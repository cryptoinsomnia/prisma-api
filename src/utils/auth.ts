import { FacebookUser } from './facebook';
import { Context } from './utils';
export const ctxUser = (ctx) => ctx.request.user;

export const isLoggedIn = (ctx) => {
  if (!ctx.request.user) { throw new Error(`Not logged in`); }
  return ctxUser(ctx);
};

export const createUserFromFacebook = async (ctx: Context, facebookUser: FacebookUser) => {
  return ctx.db.mutation.createUser({
    data: {
      facebookUserId: facebookUser.id,
      name: facebookUser.name,
      username: facebookUser.name.replace(/[\W_-]/g, '').toLowerCase(),
      facebookEmail: facebookUser.email,
      profileImageUrl: facebookUser.picture.data.url,
      userType: 'NORMAL',
    },
  });
};
