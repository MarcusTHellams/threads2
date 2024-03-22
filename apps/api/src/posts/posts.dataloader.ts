import { Injectable } from '@nestjs/common';
import { DrizzleService } from 'src/drizzle/drizzle.service';
import groupBy from 'lodash/groupBy';
import keyBy from 'lodash/keyBy';
import DataLoader from 'dataloader';

@Injectable()
export class PostDataLoader {
  constructor(private readonly client: DrizzleService) {}

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
}
