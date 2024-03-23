import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
  Context as Ctx,
} from '@nestjs/graphql';
import { UsersService } from './users.service';
import { CreateUserInput } from './dto/create-user.input';
import { User } from 'src/graphql';
import { Context } from 'src/common/types';
import { UserInsert } from 'database';

@Resolver('User')
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation('createUser')
  create(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.usersService.create(createUserInput);
  }

  @Query('users')
  findAll() {
    return this.usersService.findAll();
  }

  @Query('user')
  findOne(@Args('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Mutation('updateUser')
  async update(@Args('updateUserInput') updateUserInput: Partial<UserInsert>) {
    return this.usersService.update(updateUserInput.userId, updateUserInput);
  }

  @Mutation('removeUser')
  remove(@Args('id') id: string) {
    return this.usersService.remove(id);
  }

  @ResolveField()
  async followers(
    @Parent() parent: User,
    @Ctx() { userFollowLoader }: Context,
  ) {
    return userFollowLoader.load(parent.userId);
  }
  @ResolveField()
  async follows(
    @Parent() parent: User,
    @Ctx() { userFolloweeLoader }: Context,
  ) {
    return userFolloweeLoader.load(parent.userId);
  }

  @ResolveField()
  async posts(@Parent() parent: User, @Ctx() { usePostsLoader }: Context) {
    return usePostsLoader.load(parent.userId);
  }
  @ResolveField()
  async likes(
    @Parent() parent: User,
    @Ctx() { useLikesForUserLoader }: Context,
  ) {
    return useLikesForUserLoader.load(parent.userId);
  }
}
