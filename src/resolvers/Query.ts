import { getUserId, Context } from "../utils/utils";

export const Query = {
  feed(parent, { first, orderBy }, ctx: Context, info) {
    return ctx.db.query.posts({ first: first, orderBy: orderBy }, info);
  },

  user(parent, { username }, ctx: Context, info) {
    return ctx.db.query.user({ where: { username: username } }, info);
  },

  /*drafts(parent, args, ctx: Context, info) {
    const id = getUserId(ctx)

    const where = {
      isPublished: false,
      author: {
        id
      }
    }

    return ctx.db.query.posts({ where }, info)
  },*/

  post(parent, { id }, ctx: Context, info) {
    return ctx.db.query.post({ where: { id: id } }, info);
  },

  me(parent, args, ctx: Context, info) {
    const id = getUserId(ctx);
    return ctx.db.query.user({ where: { id } }, info);
  }
};
