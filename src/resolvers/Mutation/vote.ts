import { Context, getUserId, incrementUserKarma } from '../../utils/utils';
import { user } from './user';

export const vote = {
    async voteOnPost(parent, { postId }, ctx: Context, info) {
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

        // Check if I already voted on this post
        const votes = await ctx.db.query.votes({
            where: {
                post: {
                    id: postId,
                },
                voter: {
                    id: userId,
                },
            }
        });
        if (votes.length > 0) {
            throw new Error(`Already voted on this post`);
        }
        incrementUserKarma(post.author.id, ctx, info);
        return ctx.db.mutation.createVote(
            {
                data: {
                    score: 1,
                    contentType: 'POST',
                    voter: {
                        connect: { id: userId },
                    },
                    post: {
                        connect: { id: post.id },
                    },
                },
            },
            info);
    },

    async deleteVotes(parent, { userId }, ctx: Context, info) {
        const myUserId = getUserId(ctx);
        if (myUserId !== userId) {
            const myUser = await ctx.db.query.user(
                { where: { id: userId } }, null,
            );
            if (myUser.admin !== true) {
                throw new Error(`User can only delete own votes or needs to be admin`);
            }
        }
        return ctx.db.mutation.deleteManyVotes({ where: { voter: { id: userId } } }, info);
    },
};
