import { Injectable } from '@nestjs/common';
import { DrizzleService } from 'src/drizzle/drizzle.service';
import groupBy from 'lodash/groupBy';
import DataLoader from 'dataloader';

@Injectable()
export class UserDataLoader {
  constructor(private readonly client: DrizzleService) {}

  private batchFollowers() {
    const db = this.client.db;
    return async function (ids: string[]) {
      console.log('ids: ', ids);
      const followers = await db.query.follow.findMany({
        where({ followeeId }, { inArray }) {
          return inArray(followeeId, ids);
        },
        with: {
          follower: true,
        },
      });
      console.log('followers: ', JSON.stringify(followers, null, 2));

      const groupedByFollowers = groupBy(followers, (follower) => {
        return follower.followeeId;
      });

      return ids.map((id) => {
        return groupedByFollowers[id].map((item) => item.follower);
      });
    };
  }
  public useFollowerLoader() {
    return new DataLoader(this.batchFollowers());
  }
  private batchFollowees() {
    const db = this.client.db;
    return async function (ids: string[]) {
      const followees = await db.query.follow.findMany({
        where({ followerId }, { inArray }) {
          return inArray(followerId, ids);
        },
        with: {
          followee: true,
        },
      });

      const groupedByFollowees = groupBy(followees, (followee) => {
        return followee.followerId;
      });

      return ids.map((id) => {
        return groupedByFollowees[id].map((item) => item.followee);
      });
    };
  }
  public useFolloweeLoader() {
    return new DataLoader(this.batchFollowees());
  }
}
