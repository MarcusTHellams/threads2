import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsResolver } from './posts.resolver';
import { PostDataLoader } from './posts.dataloader';

@Module({
  providers: [PostsResolver, PostsService, PostDataLoader],
  exports: [PostDataLoader],
})
export class PostsModule {}
