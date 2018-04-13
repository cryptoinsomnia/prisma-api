import { Context, getUserId } from '../../utils/utils';

export const post = {
  async deletePost(parent, { id }, ctx: Context, info) {
    const userId = getUserId(ctx);
    const postExists = await ctx.db.exists.Post({
      id,
      author: { id: userId },
    });
    if (!postExists) {
      throw new Error(`Post not found or you're not the author`);
    }

    return ctx.db.mutation.deletePost({ where: { id } });
  },
  async createPost(parent, { title, url, content, tags }, ctx: Context, info) {
    const userId = getUserId(ctx);
    return ctx.db.mutation.createPost(
      {
        data: {
          author: {
            connect: { id: userId },
          },
          title,
          url,
          content,
          tags,
        },
      },
      info,
    );
  },
};
