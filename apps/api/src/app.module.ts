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

@Module({
  imports: [
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [UsersModule, PostsModule],
      inject: [UserDataLoader, PostDataLoader],
      async useFactory(dataLoader: UserDataLoader, postdl: PostDataLoader) {
        return {
          context(): Context {
            return {
              userFolloweeLoader: dataLoader.useFolloweeLoader(),
              userFollowLoader: dataLoader.useFollowerLoader(),
              usePostsLoader: dataLoader.usePostsLoader(),
              usePostedByLoader: postdl.usePostedByLoader(),
              useLikeLoaderForPost: postdl.useLikeLoaderForPost(),
              useLikesForUserLoader: dataLoader.useLikesForUserLoader(),
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
