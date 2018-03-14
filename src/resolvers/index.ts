import { auth } from './Mutation/auth';
import { comment } from './Mutation/comment';
import { post } from './Mutation/post';
import { user } from './Mutation/user';
import { vote } from './Mutation/vote';
import { Query } from './Query';

export default {
  Query,
  Mutation: {
    ...auth,
    ...post,
    ...comment,
    ...user,
    ...vote,
  },
};
