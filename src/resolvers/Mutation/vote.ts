import { Context, getUserId } from '../../utils/utils';

export const vote = {
//   async deletePost(parent, { id }, ctx: Context, info) {
//     const userId = getUserId(ctx);
//     const postExists = await ctx.db.exists.Post({
//       id,
//       author: { id: userId },
//     });
//     if (!postExists) {
//       throw new Error(`Post not found or you're not the author`);
//     }

//     return ctx.db.mutation.deletePost({ where: { id } });
//   },
  async voteOnPost(parent, { postId }, ctx: Context, info) {
    const userId = getUserId(ctx);
    const post = await ctx.db.query.post({where : { id: postId }});
    if (!post) {
        throw new Error(`Post does not exist`);
      }

      // Check if I already voted on this post
    const votes = await ctx.db.query.votes({where : {
        post : {
            id: postId,
        },
        voter : {
            id: userId,
        },
        }});
    if (votes.length > 0) {
        throw new Error(`Already voted on this post`);
      }

    return ctx.db.mutation.createVote(
          {
            data: {
                score: 1,
                contentType: 'POST',
                voter: {
                    connect: {id : userId},
                },
                post: {
                    connect: {id : post.id},
                },
            },
        },
        info);
  },
};
