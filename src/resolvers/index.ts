import { auth } from './Mutation/auth';
import { post } from './Mutation/post';
import { user } from './Mutation/user';
import { Query } from './Query';

export default {
  Query,
  Mutation: {
    ...auth,
    ...post,
    ...user,
  },
};
