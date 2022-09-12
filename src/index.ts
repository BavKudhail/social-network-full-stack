import 'reflect-metadata';
import { MikroORM, RequestContext } from '@mikro-orm/core';
import { __prod__ } from './constants';
import microConfig from './mikro-orm.config';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { HelloResolver } from './resolvers/hello';
import { PostResolver } from './resolvers/post';
import { UserResolver } from './resolvers/user';
import session from 'express-session';
import { on } from 'events';
import { MyContext } from './types';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';

// declaring an express session in order to access the user ID
declare module 'express-session' {
  export interface SessionData {
    user: { [key: string]: any };
  }
}

const RedisStore = require('connect-redis')(session);
const { createClient } = require('redis');

const main = async () => {
  const orm = await MikroORM.init(microConfig);
  orm.getMigrator().up();

  const app = express();

  const redisClient = createClient({ legacyMode: true });
  redisClient.connect().catch(console.error);

  app.use((req, res, next) => {
    RequestContext.create(orm.em, next);
  });

  // session middleware
  app.use(
    session({
      name: 'qid',
      store: new RedisStore({
        client: redisClient,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, //10 years
        httpOnly: true,
        secure: __prod__, //cookie only works in https
        // TODO - research into the below property
        sameSite: 'lax',
      },
      saveUninitialized: false,
      secret: 'skufkiskiqaksed',
      resave: false,
    })
  );

  // apollo middleware
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }) => ({ em: orm.em, req, res }),
  });

  // added this line
  await apolloServer.start();

  //   create a graphql end-point an express
  apolloServer.applyMiddleware({
    app,
  });

  app.listen(4000, () => {
    console.log('server running on localhost:4000');
  });
};

main();
