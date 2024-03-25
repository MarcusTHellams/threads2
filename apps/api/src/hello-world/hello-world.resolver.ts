import { UseGuards } from '@nestjs/common';
import { Query } from '@nestjs/graphql';
import { Resolver } from '@nestjs/graphql';
import { GqlAuthGuard } from 'src/auth/accessTokenGraphql.guard';

@Resolver()
export class HelloWorldResolver {
  @UseGuards(GqlAuthGuard)
  @Query('helloWorld')
  helloWorld() {
    return 'Hello World';
  }
}
