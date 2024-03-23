import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
  Context as Ctx,
} from '@nestjs/graphql';
import { PostsService } from './posts.service';
import { CreatePostInput, Post, UpdatePostInput } from 'src/graphql';
import { Context } from 'src/common/types';

@Resolver('Post')
export class PostsResolver {
  constructor(private readonly postsService: PostsService) {}

  @Mutation('createPost')
  create(@Args('createPostInput') createPostInput: CreatePostInput) {
    return this.postsService.create(createPostInput);
  }

  @Query('posts')
  findAll() {
    return this.postsService.findAll();
  }

  @Query('post')
  findOne(@Args('id') id: number) {
    return this.postsService.findOne(id);
  }

  @Mutation('updatePost')
  update(@Args('updatePostInput') updatePostInput: UpdatePostInput) {
    return this.postsService.update(updatePostInput.postId, updatePostInput);
  }

  @Mutation('removePost')
  remove(@Args('id') id: number) {
    return this.postsService.remove(id);
  }

  @ResolveField()
  async postedBy(
    @Parent() parent: Post,
    @Ctx() { usePostedByLoader }: Context,
  ) {
    return usePostedByLoader.load(parent.postId);
  }
  @ResolveField()
  async likes(
    @Parent() parent: Post,
    @Ctx() { useLikeLoaderForPost }: Context,
  ) {
    return useLikeLoaderForPost.load(parent.postId);
  }
}
