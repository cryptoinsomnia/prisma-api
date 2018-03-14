import { Context, getUserId } from '../utils/utils';

export const Query = {
  feed(parent, { first, orderBy }, ctx: Context, info) {
    return ctx.db.query.posts({ first, orderBy }, info);
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
