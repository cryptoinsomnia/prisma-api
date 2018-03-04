import { Context, getUserId } from '../../utils/utils';

export const user = {
  async deleteUser(parent, { id }, ctx: Context, info) {
    const userId = getUserId(ctx);
    if (userId !== id) {
        const myUser = await ctx.db.query.user(
            { where: { id: userId } }, null,
        );
        if (myUser.admin !== true) {
            throw new Error(`User can only delete own account or needs to be admin`);
        }
    }
    // Make sure user exists
    const userExists = await ctx.db.exists.User({
        id,
    });
    if (!userExists) {
        throw new Error(`User not found`);
    }
    return ctx.db.mutation.deleteUser({ where: { id } }, info);
  },
};
