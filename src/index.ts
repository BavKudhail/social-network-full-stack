import 'reflect-metadata';
import { MikroORM, RequestContext } from '@mikro-orm/core';
import { __prod__ } from './constants';
import microConfig from './mikro-orm.config';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { HelloResolver } from './resolvers/hello';
import { PostResolver } from './resolvers/post';

const main = async () => {
  const orm = await MikroORM.init(microConfig);
  orm.getMigrator().up();

  const app = express();

  app.use((req, res, next) => {
    RequestContext.create(orm.em, next);
  });

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver],
      validate: false,
    }),

    // context is an object shared by all resolvers
    context: () => ({ em: orm.em }),
  });

  // added this line
  await apolloServer.start();

  //   create a graphql end-point an express
  apolloServer.applyMiddleware({
    app,
  });

  app.get('/', (_, res) => {
    res.send('hello');
  });

  app.listen(4000, () => {
    console.log('server running on localhost:4000');
  });
};

main();

console.log('hey there');
