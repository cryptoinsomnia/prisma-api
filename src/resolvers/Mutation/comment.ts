import { Context, getUserId } from '../../utils/utils';

export const comment = {
    async deleteComment(parent, { id }, ctx: Context, info) {
        const userId = getUserId(ctx);
        const commentExists = await ctx.db.exists.Comment({
            id,
            author: { id: userId },
        });
        if (!commentExists) {
            throw new Error(`Comment not found or you're not the author`);
        }

        return ctx.db.mutation.delete({ where: { id } });
    },
    async createComment(parent, { content, postId, directParentType }, ctx: Context, info) {
        const userId = getUserId(ctx);
        const post = await ctx.db.query.post({ where: { id: postId } });
        if (!post) {
            throw new Error(`Post does not exist`);
        }
        return ctx.db.mutation.createComment(
            {
                data: {
                    content,
                    directParentType,
                    author: {
                        connect: { id: userId },
                    },
                    post: {
                        connect: { id: post.id },
                    },
                },
            },
            info,
        );
    },
};
