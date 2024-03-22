import { Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { DrizzleService } from 'src/drizzle/drizzle.service';
import { user, UserInsert } from 'database';
import { eq } from 'drizzle-orm';

@Injectable()
export class UsersService {
  constructor(private readonly ds: DrizzleService) {}
  create(createUserInput: CreateUserInput) {
    return 'This action adds a new user';
  }

  findAll() {
    const db = this.ds.db;
    return db.query.user.findMany({
      with: {
        followers: {
          with: {
            follower: true,
          },
        },
      },
    });
  }

  findOne(id: string) {
    const db = this.ds.db;
    return db.query.user.findFirst({
      where({ userId }, { eq }) {
        return eq(userId, id);
      },
    });
  }

  async update(id: string, updateUserInput: Partial<UserInsert>) {
    const db = this.ds.db;
    return db
      .update(user)
      .set({ ...updateUserInput, updatedAt: new Date() })
      .where(eq(user.userId, id))
      .returning()
      .then((resp) => resp[0]);
  }

  remove(id: string) {
    const db = this.ds.db;
    return db.delete(user).where(eq(user.userId, id)).returning();
  }
}
