import { Module } from '@nestjs/common';
import { RepliesService } from './replies.service';
import { RepliesResolver } from './replies.resolver';
import { RepliesDataLoader } from './replies.dataloader';

@Module({
  providers: [RepliesResolver, RepliesService, RepliesDataLoader],
  exports: [RepliesDataLoader],
})
export class RepliesModule {}
