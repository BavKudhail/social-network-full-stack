import { Property, PrimaryKey, Entity, OptionalProps } from '@mikro-orm/core';

@Entity()
export class Post {
  [OptionalProps]?: 'createdAt' | 'title' | 'updatedAt';

  // these correspond to columns
  @PrimaryKey()
  id!: number;

  @Property()
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();

  @Property()
  title!: string;
}
