import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { UserDataLoader } from './users.dataloader';

@Module({
  providers: [UsersResolver, UsersService, UserDataLoader],
  exports: [UserDataLoader],
})
export class UsersModule {}
