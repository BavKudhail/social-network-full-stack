import { __prod__ } from './constants';
import { Post } from './entities/Post';
import { Options } from '@mikro-orm/core';
import path from 'path';

const config: Options = {
  migrations: {
    path: path.join(__dirname, './migrations'),
    glob: '!(*.d).{js,ts}',
  },

  entities: [Post],
  dbName: 'redditDB',
  user: 'postgres',
  password: '19.january',
  debug: !__prod__,
  type: 'postgresql',
};

export default config;
