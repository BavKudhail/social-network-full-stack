import { MikroORM } from '@mikro-orm/core';
import { __prod__ } from './constants';
import { Post } from './entities/Post';

const main = async () => {
  const orm = await MikroORM.init({
    // entities correspond to database tables
    entities: [Post],
    dbName: 'redditDB',
    user: 'postgres',
    password: '19.january',
    debug: !__prod__,
    type: 'postgresql',
  });

  //   create a post and insert it into database
  const post = orm.em.create(Post, {
    title: 'my first post',
  });
  //   insert posts
  await orm.em.persistAndFlush(post);
  //
  await orm.em.nativeInsert(Post, { title: 'my first post 2' });
};

main();
