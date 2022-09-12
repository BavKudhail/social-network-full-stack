import { User } from '../entities/User';
import { MyContext } from 'src/types';
import argon2 from 'argon2';

import {
  Resolver,
  Mutation,
  Arg,
  InputType,
  Field,
  Ctx,
  ObjectType,
  Query,
} from 'type-graphql';

@InputType()
class UsernamePasswordInput {
  @Field()
  username: string;
  @Field()
  password: string;
}

@ObjectType()
class FieldError {
  @Field()
  field: string;
  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

// SAVE USER TO DATABASE
@Resolver(User)
export class UserResolver {
  // GET ALL USERS
  @Query(() => [User])
  getAllUsers(@Ctx() { em }: MyContext): Promise<User[]> {
    return em.find(User, {});
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg('options') options: UsernamePasswordInput,
    @Ctx() { em }: MyContext
  ): Promise<UserResponse> {
    // username
    if (options.username.length <= 2) {
      return {
        errors: [
          {
            field: 'username',
            message: 'length must be greater than 2',
          },
        ],
      };
    }
    // password
    if (options.password.length <= 3) {
      return {
        errors: [
          {
            field: 'password',
            message: 'length must be greater than 3',
          },
        ],
      };
    }
    // hash password
    const hashedPassword = await argon2.hash(options.password);
    const user = em.create(User, {
      username: options.username,
      password: hashedPassword,
    });
    try {
      await em.persistAndFlush(user);
    } catch (error) {
      if (error.code === '23505' || error.detail.includes('23505')) {
        return {
          errors: [
            {
              field: 'username',
              message: 'the username has already been taken',
            },
          ],
        };
      }
    }

    return {
      user,
    };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg('options') options: UsernamePasswordInput,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    const user = await em.findOneOrFail(User, {
      username: options.username,
    });

    if (!user) {
      return {
        errors: [
          {
            field: 'username',
            message: ' incorrect username',
          },
        ],
      };
    }
    // verify the user password
    const valid = await argon2.verify(user.password, options.password);

    // if password is not valid, return errors
    if (!valid) {
      return {
        errors: [
          {
            field: 'password',
            message: 'incorrect password',
          },
        ],
      };
    }

    // storing userId inside the session
    req.session.user = user.id;

    console.log('USER ID: ', req.session.user);

    // return useraa
    return {
      user,
    };
  }

  //   STORING COOKIES IN THE USERS BROWSER
}
