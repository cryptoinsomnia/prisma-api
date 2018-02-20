import { Context } from "./utils";
import { FacebookUser } from "./facebook";
export const ctxUser = ctx => ctx.request.user;

export const isLoggedIn = ctx => {
  if (!ctx.request.user) throw new Error(`Not logged in`);
  return ctxUser(ctx);
};

export const createUserFromFacebook = async (ctx : Context, facebookUser : FacebookUser) => {
  return ctx.db.mutation.createUser({
    data: {
      facebookUserId: facebookUser.id,
      name: facebookUser.name,
      facebookEmail: facebookUser.email,
      userType: 'NORMAL'
    }
  });
};
