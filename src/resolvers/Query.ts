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

  // TODO make this take in a 'WHERE POST ID is x' qualifier
  comments(parent, { first }, ctx: Context, info) {
    return ctx.db.query.comments({ first }, info);
  },

  me(parent, args, ctx: Context, info) {
    const id = getUserId(ctx);
    return ctx.db.query.user({ where: { id } }, info);
  },
};
