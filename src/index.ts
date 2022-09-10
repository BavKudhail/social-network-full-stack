import { MikroORM } from '@mikro-orm/core';
import { __prod__ } from './constants';

const main = async () => {
  const orm = await MikroORM.init({
    dbName: 'redditDB',
    user: 'postgres',
    password: '19.january',
    debug: !__prod__,
    type: 'postgresql',
  });
};

main();
