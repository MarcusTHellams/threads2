import { Injectable } from '@nestjs/common';
import { CreatePostInput, UpdatePostInput } from 'src/graphql';
import { DatabaseClient, DrizzleService } from 'src/drizzle/drizzle.service';
import { post } from 'database';
import { UserSelect } from 'database';
import { eq } from 'drizzle-orm';

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
