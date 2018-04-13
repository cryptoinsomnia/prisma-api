import * as jwt from 'jsonwebtoken';
import { Prisma } from '../generated/prisma';

export interface Context {
  db: Prisma;
  request: any;
}

export function getUserId(ctx: Context) {
  const Authorization = ctx.request.get('Authorization');
  if (Authorization) {
    const token = Authorization.replace('Bearer ', '');
    const { userId } = jwt.verify(token, process.env.APP_SECRET) as { userId: string };
    return userId;
  }

  throw new AuthError();
}

export class AuthError extends Error {
  constructor() {
    super('Not authorized');
  }
}

export async function incrementUserKarma(id, ctx: Context, info) {
  const userToIncrement = await ctx.db.query.user(
    { where: { id } }, null,
  );
  const curKarma = userToIncrement.karma;
  if (!curKarma) {
    curKarma = 0;
  }
  const karma = curKarma + 1;
  return ctx.db.mutation.updateUser({
    data: {
      karma,
    }, where: {
      id,
    },
  }, info);
}
