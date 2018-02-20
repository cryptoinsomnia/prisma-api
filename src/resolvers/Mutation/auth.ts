import * as jwt from 'jsonwebtoken';
import { createUserFromFacebook } from '../../utils/auth';
import { getFacebookUser } from '../../utils/facebook';
import { Context } from '../../utils/utils';

export const auth = {
  async authenticateFacebook(parent, { fbToken }, ctx: Context, info) {
    let user = null;
    try {
      const facebookUser = await getFacebookUser(fbToken);

      const exists = await ctx.db.exists.User({
        facebookUserId : facebookUser.id,
      });
      user = await ctx.db.query.user(
        { where: { facebookUserId: facebookUser.id } }, null,
      );
      if (!user) {
        user = await createUserFromFacebook(ctx, facebookUser);
      }
      return {
        user,
        token: jwt.sign({ userId: user.id }, process.env.APP_SECRET),
      };
    } catch (error) {
      throw new Error(error);
    }
  },
};
