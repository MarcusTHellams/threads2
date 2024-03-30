import { Injectable } from '@nestjs/common';
import DataLoader from 'dataloader';
import keyBy from 'lodash/keyBy';
import groupBy from 'lodash/groupBy';
import {
  DrizzleService,
  type DatabaseClient,
} from 'src/drizzle/drizzle.service';

@Injectable()
export class LikesDataLoader {
  db: DatabaseClient;
  constructor(private readonly client: DrizzleService) {
    this.db = this.client.db;
  }
  private _likesPostViaPostId() {
    const db = this.client.db;
    return async function (ids: string[]) {
      const likes = await db.query.like.findMany({
        where({ postId }, { inArray }) {
          return inArray(postId, ids);
        },
        columns: { postId: true },
        with: {
          post: true,
        },
      });
      const keyedByLikes = groupBy(likes, (post) => {
        return post.postId;
      });

      return ids.map((id) => {
        return keyedByLikes[id].map((item) => item.post);
      });
    };
  }
  public likesPostViaPostId() {
    return new DataLoader(this._likesPostViaPostId());
  }
  private _likesUserViaPostId() {
    const db = this.client.db;
    return async function (ids: string[]) {
      const likes = await db.query.like.findMany({
        where({ postId }, { inArray }) {
          return inArray(postId, ids);
        },
        columns: { postId: true },
        with: {
          user: true,
        },
      });
      const keyedByLikes = groupBy(likes, (post) => {
        return post.postId;
      });

      return ids.map((id) => {
        return keyedByLikes[id].map((item) => item.user);
      });
    };
  }
  public likesUserViaPostId() {
    return new DataLoader(this._likesUserViaPostId());
  }

  private _likesPostViaUserId() {
    const db = this.client.db;
    return async function (ids: string[]) {
      const likes = await db.query.like.findMany({
        where({ userId }, { inArray }) {
          return inArray(userId, ids);
        },
        columns: { userId: true },
        with: {
          post: true,
        },
      });
      const keyedByLikes = groupBy(likes, (post) => {
        return post.userId;
      });

      return ids.map((id) => {
        return keyedByLikes[id].map((item) => item.post);
      });
    };
  }
  public likesPostViaUserId() {
    return new DataLoader(this._likesPostViaUserId());
  }
  private _likesUserViaUserId() {
    const db = this.client.db;
    return async function (ids: string[]) {
      const likes = await db.query.like.findMany({
        where({ userId }, { inArray }) {
          return inArray(userId, ids);
        },
        columns: { userId: true },
        with: {
          user: true,
        },
      });
      const keyedByLikes = groupBy(likes, (post) => {
        return post.userId;
      });

      return ids.map((id) => {
        return keyedByLikes[id].map((item) => item.user);
      });
    };
  }
  public likesUserViaUserId() {
    return new DataLoader(this._likesUserViaUserId());
  }
}
