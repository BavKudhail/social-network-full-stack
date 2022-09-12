import { EntityManager } from '@mikro-orm/postgresql';
import { IDatabaseDriver } from '@mikro-orm/core/drivers';
import { Request, Response, Express } from 'express';
import { Connection } from '@mikro-orm/core/connections';

export type MyContext = {
  em: EntityManager;
  req: Request & { session: Express.SessionStore };
  res: Response;
};
