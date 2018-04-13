import * as moment from 'moment';
import { Context, getUserId } from '../utils/utils';

// The information we need about a Post to determine its' score.
const rankingInfoQuery = `{
  id
  createdAt
  votes {
    id
  }
}`;

export const Query = {
  async feed(parent, { first, orderBy }, ctx: Context, info) {
    if (orderBy) {
      return ctx.db.query.posts({ first, orderBy }, info);
    }
    // Max age of a post is 1 week
    const oneWeekAgo = moment().subtract(1, 'week').toISOString();
    const posts = await ctx.db.query.posts({
      orderBy: 'createdAt_DESC',
      where: {
        createdAt_gte: oneWeekAgo,
      },
    }, rankingInfoQuery);
    // As seen https://medium.com/hacking-and-gonzo/how-hacker-news-ranking-algorithm-works-1d9b0cf2c08d
    const idToScore = posts.reduce((acc, post) => {
      const points = post.votes.length;
      const createdAt = moment(post.createdAt);
      const hoursSinceSubmission = moment.duration(moment().diff(createdAt)).asHours();
      const gravity = 1.8;
      acc[post.id] = points / ((hoursSinceSubmission + 2) ** gravity);
      return acc;
    }, {});
    const scoreComparator = (post1, post2) => idToScore[post2.id] - idToScore[post1.id];
    // Sort posts by score.
    const sortedPosts = posts.sort(scoreComparator);
    // Find the ids for the top "first" (provided by query) posts.
    const topIds = sortedPosts.slice(0, first).map((post) => post.id);
    // We have to return the information the query requested.
    const topPostsWithRequestedFields = await ctx.db.query.posts({ where: {
      id_in: topIds,
    }}, info);
    // We have to sort again because we are not guaranteed ordering.
    return topPostsWithRequestedFields.sort(scoreComparator);
  },

  user(parent, { username }, ctx: Context, info) {
    return ctx.db.query.user({ where: { username } }, info);
  },

  post(parent, { id }, ctx: Context, info) {
    return ctx.db.query.post({ where: { id } }, info);
  },

  comment(parent, { id }, ctx: Context, info) {
    return ctx.db.query.comment({ where: { id } }, info);
  },

  allComments(parent, { first }, ctx: Context, info) {
    return ctx.db.query.comments({ first }, info);
  },

  async commentsForPost(parent, { postId }, ctx: Context, info) {
    const post = await ctx.db.query.post({ where: { id: postId } });
    if (!post) {
      throw new Error(`Post does not exist`);
    }
    return ctx.db.query.comments({ where: { post } }, info);
  },

  me(parent, args, ctx: Context, info) {
    const id = getUserId(ctx);
    return ctx.db.query.user({ where: { id } }, info);
  },
};
