import { Injectable } from '@nestjs/common';
import {
  CreatePostInput,
  ReplyToAPostInput,
  UpdatePostInput,
} from 'src/graphql';
import { DatabaseClient, DrizzleService } from 'src/drizzle/drizzle.service';
import { post, like, reply } from 'database';
import { UserSelect } from 'database';
import { and, eq } from 'drizzle-orm';

@Injectable()
export class PostsService {
  db: DatabaseClient;
  constructor(private readonly ds: DrizzleService) {
    this.db = this.ds.db;
  }

  async create(createPostInput: CreatePostInput) {
    const db = this.ds.db;
    return db
      .insert(post)
      .values(createPostInput)
      .returning()
      .then((resp) => resp[0]);
  }

  async likePost(postId: string, user: UserSelect) {
    return this.db.transaction(async (tx) => {
      const findPost = () => {
        return tx.query.post.findFirst({
          where(fields, { eq }) {
            return eq(fields.postId, postId);
          },
        });
      };
      const likedPost = await tx.query.like.findFirst({
        where(fields, { eq, and }) {
          return and(eq(fields.postId, postId), eq(fields.userId, user.userId));
        },
      });

      if (likedPost) {
        await tx
          .delete(like)
          .where(and(eq(like.postId, postId), eq(like.userId, user.userId)));

        return findPost();
      }
      await tx
        .insert(like)
        .values({
          updatedAt: new Date(),
          postId,
          userId: user.userId,
        })
        .returning()
        .then((resp) => resp[0]);
      return findPost();
    });
  }

  async replyToAPost({ postId, text }: ReplyToAPostInput, user: UserSelect) {
    return this.db.transaction(async (tx) => {
      await tx.insert(reply).values({
        postId,
        text,
        updatedAt: new Date(),
        userId: user.userId,
      });
      return tx.query.post.findFirst({
        where: eq(post.postId, postId),
      });
    });
  }

  async feed(user: UserSelect) {
    const _user = await this.db.query.user.findFirst({
      where({ userId }, { eq }) {
        return eq(userId, user.userId);
      },
      with: {
        follows: {
          with: {
            followee: true,
          },
        },
      },
    });

    const posts = await this.db.query.post.findMany({
      where({ userId }, { inArray }) {
        return inArray(
          userId,
          _user.follows.map((follow) => {
            return follow.followee.userId;
          }),
        );
      },
      orderBy({ createdAt }, { desc }) {
        return desc(createdAt);
      },
    });
    return posts;
  }

  findAll() {
    const db = this.ds.db;
    return db.query.post.findMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  update(id: string, updatePostInput: UpdatePostInput) {
    return `This action updates a #${id} post`;
  }

  async remove(postId: string) {
    return this.db
      .delete(post)
      .where(eq(post.postId, postId))
      .returning()
      .then((resp) => resp[0]);
  }
}
