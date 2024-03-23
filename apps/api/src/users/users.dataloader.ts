import { Injectable } from '@nestjs/common';
import DataLoader from 'dataloader';
import keyBy from 'lodash/keyBy';
import { DrizzleService, DatabaseClient } from 'src/drizzle/drizzle.service';

@Injectable()
export class UserDataLoader {
  db: DatabaseClient;
  constructor(private readonly client: DrizzleService) {
    this.db = this.client.db;
  }

  private batchFollowers() {
    const db = this.client.db;
    return async function (ids: string[]) {
      const followers = await db.query.user.findMany({
        where({ userId }, { inArray }) {
          return inArray(userId, ids);
        },
        columns: { userId: true },
        with: {
          followers: {
            columns: {},
            with: {
              follower: true,
            },
          },
        },
      });
      const keyedByFollowers = keyBy(followers, (follower) => {
        return follower.userId;
      });

      return ids.map((id) => {
        return keyedByFollowers[id].followers.map((f) => f.follower);
      });
    };
  }
  public useFollowerLoader() {
    return new DataLoader(this.batchFollowers());
  }
  private batchFollowees() {
    const db = this.client.db;
    return async function (ids: string[]) {
      const followees = await db.query.user.findMany({
        where({ userId }, { inArray }) {
          return inArray(userId, ids);
        },
        with: {
          follows: {
            with: {
              followee: true,
            },
          },
        },
      });
      const keyedByFollowees = keyBy(followees, (follower) => {
        return follower.userId;
      });

      return ids.map((id) => {
        return keyedByFollowees[id].follows.map((f) => f.followee);
      });
    };
  }
  public useFolloweeLoader() {
    return new DataLoader(this.batchFollowees());
  }
  private batchPosts() {
    const db = this.client.db;
    return async function (ids: string[]) {
      const users = await db.query.user.findMany({
        where({ userId }, { inArray }) {
          return inArray(userId, ids);
        },
        columns: {
          userId: true,
        },
        with: {
          posts: true,
        },
      });
      const keyedByUsers = keyBy(users, (user) => {
        return user.userId;
      });

      return ids.map((id) => {
        return keyedByUsers[id].posts;
      });
    };
  }
  public usePostsLoader() {
    return new DataLoader(this.batchPosts());
  }
  private batchLikes() {
    const db = this.client.db;
    return async function (ids: string[]) {
      const users = await db.query.user.findMany({
        where({ userId }, { inArray }) {
          return inArray(userId, ids);
        },
        columns: {
          userId: true,
        },
        with: {
          likes: true,
        },
      });
      const keyedByUsers = keyBy(users, (user) => {
        return user.userId;
      });

      return ids.map((id) => {
        return keyedByUsers[id].likes;
      });
    };
  }
  public useLikesForUserLoader() {
    return new DataLoader(this.batchLikes());
  }
}
