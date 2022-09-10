import { MikroORM, RequestContext } from '@mikro-orm/core';
import { __prod__ } from './constants';
import { Post } from './entities/Post';
import microConfig from './mikro-orm.config';

const main = async () => {
  const orm = await MikroORM.init(microConfig);
  orm.getMigrator().up();

  //   create fork
  const emFork = orm.em.fork();

  //   const post = emFork.create(Post, {
  //     title: 'my first post',
  //   });
  //   await orm.em.persistAndFlush(post);

  const posts = await emFork.find(Post, {});
  console.log(posts);
};

main();
