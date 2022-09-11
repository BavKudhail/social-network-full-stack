import e from 'express';
import { MyContext } from 'src/types';
import { Arg, Ctx, Int, Query, Resolver, Mutation } from 'type-graphql';
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

  //   CREATE A POST
  @Mutation(() => Post)
  async createPost(
    @Arg('title') title: string,
    @Ctx() { em }: MyContext
  ): Promise<Post | null> {
    const post = em.create(Post, { title });
    await em.persistAndFlush(post);
    return post;
  }

  //   UPDATING POST
  @Mutation(() => Post, { nullable: true })
  async updatePost(
    @Arg('id') id: number,
    @Arg('title') title: string,
    @Ctx() { em }: MyContext
  ): Promise<Post | null> {
    const post = await em.findOne(Post, { id });

    if (!post) {
      return null;
    }

    if (typeof title !== 'undefined') {
      post.title = title;
      await em.persistAndFlush(post);
    }

    return post;
  }

  //   DELETE POST
  @Mutation(() => Boolean)
  async deletePost(
    @Arg('id') id: number,
    @Ctx() { em }: MyContext
  ): Promise<Boolean> {
    try {
      await em.nativeDelete(Post, { id });
      return true;
    } catch (error) {
      return false;
    }
  }
}
