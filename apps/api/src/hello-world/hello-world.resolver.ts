import { UseGuards } from '@nestjs/common';
import { Query } from '@nestjs/graphql';
import { Resolver } from '@nestjs/graphql';
import { UserSelect } from 'database';
import { GqlAuthGuard } from 'src/auth/accessTokenGraphql.guard';
import { CurrentUser } from 'src/auth/currentUser.decorator';

@Resolver()
export class HelloWorldResolver {
  @UseGuards(GqlAuthGuard)
  @Query('helloWorld')
  helloWorld(@CurrentUser() user: UserSelect) {
    console.log('user: ', user);
    return 'Hello World';
  }
}
