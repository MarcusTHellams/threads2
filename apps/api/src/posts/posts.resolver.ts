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
import {
  CreatePostInput,
  Post,
  ReplyToAPostInput,
  UpdatePostInput,
} from 'src/graphql';
import { Context } from 'src/common/types';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/accessTokenGraphql.guard';
import { CurrentUser } from 'src/auth/currentUser.decorator';
import { UserSelect } from 'database';
import { DrizzleService } from 'src/drizzle/drizzle.service';

@Resolver('Post')
export class PostsResolver {
  constructor(
    private readonly postsService: PostsService,
    private readonly ds: DrizzleService,
  ) {}

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

  @UseGuards(GqlAuthGuard)
  @Query('feed')
  feed(@CurrentUser() user: UserSelect) {
    return this.postsService.feed(user);
  }

  @Mutation('updatePost')
  update(@Args('updatePostInput') updatePostInput: UpdatePostInput) {
    return this.postsService.update(updatePostInput.postId, updatePostInput);
  }

  @Mutation('removePost')
  remove(@Args('id') postId: string) {
    return this.postsService.remove(postId);
  }
  @Mutation('likePost')
  likePost(@Args('postId') postId: string, @CurrentUser() user: UserSelect) {
    return this.postsService.likePost(postId, user);
  }

  @Mutation('replyToAPost')
  replyToAPost(
    @Args('replyToAPostInput') replyToAPostInput: ReplyToAPostInput,
    @CurrentUser() user: UserSelect,
  ) {
    return this.postsService.replyToAPost(replyToAPostInput, user);
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
  @ResolveField()
  async replies(
    @Parent() parent: Post,
    @Ctx() { useReplyLoaderForPost }: Context,
  ) {
    return useReplyLoaderForPost.load(parent.postId);
  }
}
