import { Context, getUserId, incrementUserKarma } from '../../utils/utils';

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
    async createComment(parent, { content, postId, parentCommentId }, ctx: Context, info) {
        const userId = getUserId(ctx);
        const post = await ctx.db.query.post({ where: { id: postId } },
            `{
                id
                author {
                    id
                }
            }`);
        if (!post) {
            throw new Error(`Post does not exist`);
        }

        const directParentType = 'POST';
        const threadedParentCommentData = null;

        if (parentCommentId) {
            directParentType = 'COMMENT';
            const parentComment = await ctx.db.query.comment({ where: { id: parentCommentId } });
            if (!parentComment) {
                throw new Error(`Parent comment does not exist.`);
            }
            threadedParentCommentData = {
                connect: { id: parentCommentId },
            };
        }
        incrementUserKarma(post.author.id, ctx, info);
        return ctx.db.mutation.createComment(
            {
                data: {
                    content,
                    directParentType,
                    author: {
                        connect: { id: userId },
                    },
                    post: {
                        connect: { id: postId },
                    },
                    threadedParentComment: threadedParentCommentData,
                },
            },
            info,
        );
    },
};

async function checkPostExists(postId, ctx) {
    const post = await ctx.db.query.post({ where: { id: postId } });
    if (!post) {
        throw new Error(`Post does not exist`);
    }
}
