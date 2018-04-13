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
    async createComment(parent, { content, postId, parentCommentId }, ctx: Context, info) {
        const userId = getUserId(ctx);
        checkPostExists(postId, ctx);

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
            //threadedParentCommentData = getParentCommentData(parentCommentId, ctx);
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

function getParentCommentData(parentCommentId, ctx) {
    const parentComment = ctx.db.query.comment({ where: { id: parentCommentId } });
    if (!parentComment) {
        throw new Error(`Parent comment does not exist.`);
    }
    const threadedParentData = {
        connect: { id: parentComment.id },
    };
    return threadedParentData;
}
