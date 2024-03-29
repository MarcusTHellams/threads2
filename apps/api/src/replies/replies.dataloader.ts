import { Injectable } from '@nestjs/common';
import DataLoader from 'dataloader';
import keyBy from 'lodash/keyBy';
import {
  DrizzleService,
  type DatabaseClient,
} from 'src/drizzle/drizzle.service';

@Injectable()
export class RepliesDataLoader {
  db: DatabaseClient;
  constructor(private readonly client: DrizzleService) {
    this.db = this.client.db;
  }
  private _repliesPostedByViaPostId() {
    const db = this.client.db;
    return async function (ids: string[]) {
      const posts = await db.query.reply.findMany({
        where({ postId }, { inArray }) {
          return inArray(postId, ids);
        },
        columns: { postId: true },
        with: {
          postedBy: true,
        },
      });
      const keyedByFollowers = keyBy(posts, (post) => {
        return post.postId;
      });

      return ids.map((id) => {
        return keyedByFollowers[id].postedBy;
      });
    };
  }
  public repliesPostedByViaPostId() {
    return new DataLoader(this._repliesPostedByViaPostId());
  }
  private _repliesPostViaPostId() {
    const db = this.client.db;
    return async function (ids: string[]) {
      const posts = await db.query.reply.findMany({
        where({ postId }, { inArray }) {
          return inArray(postId, ids);
        },
        columns: { postId: true },
        with: {
          post: true,
        },
      });
      const keyedByFollowers = keyBy(posts, (post) => {
        return post.postId;
      });

      return ids.map((id) => {
        return keyedByFollowers[id].post;
      });
    };
  }
  public repliesPostViaPostId() {
    return new DataLoader(this._repliesPostViaPostId());
  }
}
