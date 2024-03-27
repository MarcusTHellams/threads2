import { Injectable } from '@nestjs/common';
import DataLoader from 'dataloader';
import keyBy from 'lodash/keyBy';
import {
  DrizzleService,
  type DatabaseClient,
} from 'src/drizzle/drizzle.service';

@Injectable()
export class PostDataLoader {
  db: DatabaseClient;
  constructor(private readonly client: DrizzleService) {
    this.db = this.client.db;
  }
  private batchPostedBy() {
    const db = this.client.db;
    return async function (ids: string[]) {
      const posts = await db.query.post.findMany({
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
  public usePostedByLoader() {
    return new DataLoader(this.batchPostedBy());
  }
  private batchLikes() {
    return async function (ids: string[]) {
      const posts = await this.db.query.post.findMany({
        where({ postId }, { inArray }) {
          return inArray(postId, ids);
        },
        columns: { postId: true },
        with: {
          likes: true,
        },
      });
      const keyedByFollowers = keyBy(posts, (post) => {
        return post.postId;
      });

      return ids.map((id) => {
        return keyedByFollowers[id].likes;
      });
    };
  }
  public useLikeLoaderForPost() {
    return new DataLoader(this.batchLikes());
  }
  private batchReplies() {
    return async function (ids: string[]) {
      const posts = await this.db.query.post.findMany({
        where({ postId }, { inArray }) {
          return inArray(postId, ids);
        },
        columns: { postId: true },
        with: {
          replies: true,
        },
      });
      const keyedByFollowers = keyBy(posts, (post) => {
        return post.postId;
      });

      return ids.map((id) => {
        return keyedByFollowers[id].replies;
      });
    };
  }
  public useReplyLoaderForPost() {
    return new DataLoader(this.batchReplies());
  }
}
