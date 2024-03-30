import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ServeStaticModule } from '@nestjs/serve-static';
import {
  resolvers as scalarResolvers,
  typeDefs as scalarTypeDefs,
} from 'graphql-scalars';
import { resolve } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { Context } from './common/types';
import { DrizzleModule } from './drizzle/drizzle.module';
import { HelloWorldResolver } from './hello-world/hello-world.resolver';
import { LikesDataLoader } from './likes/likes.dataloader';
import { LikesModule } from './likes/likes.module';
import { PostDataLoader } from './posts/posts.dataloader';
import { PostsModule } from './posts/posts.module';
import { RepliesDataLoader } from './replies/replies.dataloader';
import { RepliesModule } from './replies/replies.module';
import { UserDataLoader } from './users/users.dataloader';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [UsersModule, PostsModule, RepliesModule, LikesModule],
      inject: [
        UserDataLoader,
        PostDataLoader,
        RepliesDataLoader,
        LikesDataLoader,
      ],
      async useFactory(
        dataLoader: UserDataLoader,
        postDl: PostDataLoader,
        repliesDl: RepliesDataLoader,
        likesDl: LikesDataLoader,
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
              likesPostViaPostId: likesDl.likesPostViaPostId(),
              likesUserViaPostId: likesDl.likesUserViaPostId(),
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
      rootPath: resolve(__dirname, '../../../', 'client/dist/'),
      exclude: ['/api/(.*)', '/graphql/(.*)'],
    }),
    DrizzleModule,
    UsersModule,
    PostsModule,
    AuthModule,
    RepliesModule,
    LikesModule,
  ],
  controllers: [AppController],
  providers: [AppService, HelloWorldResolver],
})
export class AppModule {}
