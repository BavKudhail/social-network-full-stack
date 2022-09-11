import { Property, PrimaryKey, Entity, OptionalProps } from '@mikro-orm/core';
import { Field, Int, ObjectType } from 'type-graphql';

// some fields are exposed others are hidden

@ObjectType()
@Entity()
export class User {
  [OptionalProps]?: 'createdAt' | 'username' | 'updatedAt' | 'password';

  @Field(() => Int)
  @PrimaryKey()
  id!: number;

  @Field(() => String)
  @Property({ type: 'date' })
  createdAt = new Date();

  @Field(() => String)
  @Property({ type: 'date', onUpdate: () => new Date() })
  updatedAt = new Date();

  @Field()
  @Property({ type: 'text', unique: true })
  username!: string;

  //   @Field()
  @Property({ type: 'text' })
  password!: string;
}
