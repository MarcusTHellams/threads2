import {
  Parent,
  ResolveField,
  Resolver,
  Context as Ctx,
} from '@nestjs/graphql';
import { Reply } from 'src/graphql';
import { Context } from 'src/common/types';

@Resolver('Reply')
export class RepliesResolver {
  @ResolveField()
  async postedBy(
    @Parent() parent: Reply,
    @Ctx() { repliesPostedByViaPostId }: Context,
  ) {
    return repliesPostedByViaPostId.load(parent.postId);
  }
  @ResolveField()
  async post(
    @Parent() parent: Reply,
    @Ctx() { repliesPostViaPostId }: Context,
  ) {
    return repliesPostViaPostId.load(parent.postId);
  }
}
