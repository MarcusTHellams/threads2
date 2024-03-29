import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { DrizzleModule } from './drizzle/drizzle.module';
import { ConfigModule } from '@nestjs/config';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { UsersModule } from './users/users.module';
import {
  resolvers as scalarResolvers,
  typeDefs as scalarTypeDefs,
} from 'graphql-scalars';
import { UserDataLoader } from './users/users.dataloader';
import { Context } from './common/types';
import { PostsModule } from './posts/posts.module';
import { PostDataLoader } from './posts/posts.dataloader';
import { AuthModule } from './auth/auth.module';
import { HelloWorldResolver } from './hello-world/hello-world.resolver';
import { Request } from 'express';
import { RepliesModule } from './replies/replies.module';
import { RepliesDataLoader } from './replies/replies.dataloader';

@Module({
  imports: [
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [UsersModule, PostsModule, RepliesModule],
      inject: [UserDataLoader, PostDataLoader, RepliesDataLoader],
      async useFactory(
        dataLoader: UserDataLoader,
        postDl: PostDataLoader,
        repliesDl: RepliesDataLoader,
      ) {
        return {
          context({ req, res }): Context {
            return {
              userFolloweeLoader: dataLoader.useFolloweeLoader(),
              userFollowLoader: dataLoader.useFollowerLoader(),
              usePostsLoader: dataLoader.usePostsLoader(),
              usePostedByLoader: postDl.usePostedByLoader(),
              useLikeLoaderForPost: postDl.useLikeLoaderForPost(),
              useLikesForUserLoader: dataLoader.useLikesForUserLoader(),
              useReplyLoaderForPost: postDl.useReplyLoaderForPost(),
              repliesPostedByViaPostId: repliesDl.repliesPostedByViaPostId(),
              repliesPostViaPostId: repliesDl.repliesPostViaPostId(),
              req: req,
              res: res,
            };
          },
          resolvers: { ...scalarResolvers },
          typeDefs: [...scalarTypeDefs],
          playground: false,
          plugins: [ApolloServerPluginLandingPageLocalDefault()],
          typePaths: ['./**/*.graphql'],
        };
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../client/dist'),
      exclude: ['/api/(.*)', '/graphql/(.*)'],
    }),
    DrizzleModule,
    UsersModule,
    PostsModule,
    AuthModule,
    RepliesModule,
  ],
  controllers: [AppController],
  providers: [AppService, HelloWorldResolver],
})
export class AppModule {}
