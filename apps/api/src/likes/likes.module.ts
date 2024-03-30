import { Module } from '@nestjs/common';
import { LikesService } from './likes.service';
import { LikesResolver } from './likes.resolver';
import { LikesDataLoader } from './likes.dataloader';

@Module({
  providers: [LikesResolver, LikesService, LikesDataLoader],
  exports: [LikesDataLoader],
})
export class LikesModule {}
