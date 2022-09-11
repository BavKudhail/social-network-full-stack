import { User } from '../entities/User';
import { MyContext } from 'src/types';
import argon2 from 'argon2';

import { Resolver, Mutation, Arg, InputType, Field, Ctx } from 'type-graphql';

@InputType()
class UsernamePasswordInput {
  @Field()
  username: string;
  @Field()
  password: string;
}

// SAVE USER TO DATABASE
@Resolver()
export class UserResolver {
  @Mutation(() => User)
  async register(
    @Arg('options') options: UsernamePasswordInput,
    @Ctx() { em }: MyContext
  ) {
    // hash password
    const hashedPassword = await argon2.hash(options.password);
    const user = em.create(User, {
      username: options.username,
      password: hashedPassword,
    });
    await em.persistAndFlush(user);
    return user;
  }
}
