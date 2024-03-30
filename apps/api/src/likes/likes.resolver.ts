import {
  Parent,
  ResolveField,
  Resolver,
  Context as Ctx,
} from '@nestjs/graphql';
import { Context } from 'src/common/types';
import { Like } from 'src/graphql';

@Resolver('Like')
export class LikesResolver {
  @ResolveField()
  async post(@Parent() parent: Like, @Ctx() { likesPostViaPostId }: Context) {
    return likesPostViaPostId.load(parent.postId);
  }
  @ResolveField()
  async user(@Parent() parent: Like, @Ctx() { likesUserViaPostId }: Context) {
    return likesUserViaPostId.load(parent.postId);
  }
}
