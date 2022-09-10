import { Property, PrimaryKey, Entity, OptionalProps } from '@mikro-orm/core';

@Entity()
export class Post {
  [OptionalProps]?: 'createdAt' | 'title' | 'updatedAt';

  // these correspond to columns
  @PrimaryKey()
  id!: number;

  @Property({ type: 'date' })
  createdAt = new Date();

  @Property({ type: 'date', onUpdate: () => new Date() })
  updatedAt = new Date();

  @Property({ type: 'text' })
  title!: string;
}
