import { MyContext } from 'src/types';
import { Arg, Ctx, Int, Query, Resolver } from 'type-graphql';
import { isContext } from 'vm';
import { Post } from '../entities/Post';

@Resolver()
// GET ALL POSTS
export class PostResolver {
  @Query(() => [Post])
  posts(@Ctx() { em }: MyContext): Promise<Post[]> {
    return em.find(Post, {});
  }

  //   GET A SINGLE POST
  @Query(() => Post, { nullable: true })
  post(
    @Arg('id', () => Int) id: number,
    @Ctx() { em }: MyContext
  ): Promise<Post | null> {
    return em.findOne(Post, { id });
  }
}
