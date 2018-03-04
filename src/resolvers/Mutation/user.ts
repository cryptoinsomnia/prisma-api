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
  async editUser(parent, { id, name, profileImageUrl, email, about }, ctx: Context, info) {
    const userId = getUserId(ctx);
    const userExists = await ctx.db.exists.User({
        id,
    });
    if (!userExists) {
        throw new Error(`User not found`);
    }
    const myUser = await ctx.db.query.user(
        { where: { id: userId } }, null,
    );
    if (id !== userId && myUser.admin !== true) {
        throw new Error(`User can only edit own account or needs to be admin`);
    }

    return ctx.db.mutation.updateUser({
        data: {
            name,
            profileImageUrl,
            email,
            about,
        }, where: {
            id,
        },
    }, info);
  },
};
