import { BaseEntity, Property, PrimaryKey, Entity } from '@mikro-orm/core';

@Entity()
export class Book {
  @PrimaryKey()
  id!: number;

  @Property()
  createdAt = new Date();

  @Property({
    onUpdate: () => new Date(),
  })
  updatedAt = new Date();
  @Property()
  title!: string;
}
