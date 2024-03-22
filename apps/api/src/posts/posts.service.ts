import { Injectable } from '@nestjs/common';
import { CreatePostInput, UpdatePostInput } from 'src/graphql';
import { DrizzleService } from 'src/drizzle/drizzle.service';
import { post } from 'database';

@Injectable()
export class PostsService {
  constructor(private readonly ds: DrizzleService) {}

  async create(createPostInput: CreatePostInput) {
    const db = this.ds.db;
    return db
      .insert(post)
      .values(createPostInput)
      .returning()
      .then((resp) => resp[0]);
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

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
