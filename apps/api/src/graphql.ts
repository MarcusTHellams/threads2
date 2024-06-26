
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export class CreatePostInput {
    postId?: Nullable<string>;
    userId: string;
    text: string;
    image?: Nullable<string>;
    createdAt?: Nullable<Date>;
    updatedAt: Date;
}

export class UpdatePostInput {
    postId?: Nullable<string>;
    userId?: Nullable<string>;
    text?: Nullable<string>;
    image?: Nullable<string>;
    createdAt?: Nullable<Date>;
    updatedAt?: Nullable<Date>;
}

export class ReplyToAPostInput {
    postId: string;
    text: string;
}

export class CreateUserInput {
    name: string;
    email: string;
    password: string;
    profilePic?: Nullable<string>;
    bio?: Nullable<string>;
    isFrozen?: Nullable<boolean>;
}

export class UpdateUserInput {
    name?: Nullable<string>;
    userId?: Nullable<string>;
    email?: Nullable<string>;
    password?: Nullable<string>;
    profilePic?: Nullable<string>;
    bio?: Nullable<string>;
    isFrozen?: Nullable<boolean>;
    createdAt?: Nullable<Date>;
    updatedAt?: Nullable<Date>;
}

export abstract class IQuery {
    abstract helloWorld(): string | Promise<string>;

    abstract posts(): Nullable<Post>[] | Promise<Nullable<Post>[]>;

    abstract post(id: string): Nullable<Post> | Promise<Nullable<Post>>;

    abstract feed(): Nullable<Nullable<Post>[]> | Promise<Nullable<Nullable<Post>[]>>;

    abstract users(): Nullable<User>[] | Promise<Nullable<User>[]>;

    abstract user(id: string): Nullable<User> | Promise<Nullable<User>>;
}

export class Like {
    postId: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
    post: Post;
    user: User;
}

export class Post {
    postId: string;
    userId: string;
    text: string;
    image?: Nullable<string>;
    createdAt: Date;
    updatedAt: Date;
    likes?: Nullable<Nullable<Like>[]>;
    postedBy: User;
    replies?: Nullable<Nullable<Reply>[]>;
}

export abstract class IMutation {
    abstract createPost(createPostInput: CreatePostInput): Post | Promise<Post>;

    abstract updatePost(updatePostInput: UpdatePostInput): Post | Promise<Post>;

    abstract removePost(id: string): Post | Promise<Post>;

    abstract likePost(postId: string): Post | Promise<Post>;

    abstract replyToAPost(replyToAPostInput: ReplyToAPostInput): Post | Promise<Post>;

    abstract createUser(createUserInput: CreateUserInput): User | Promise<User>;

    abstract updateUser(updateUserInput: UpdateUserInput): User | Promise<User>;

    abstract removeUser(id: string): Nullable<User> | Promise<Nullable<User>>;
}

export class Reply {
    replyId: string;
    text: string;
    postId: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
    postedBy: User;
    post: Post;
}

export class User {
    name: string;
    userId: string;
    email: string;
    profilePic?: Nullable<string>;
    bio?: Nullable<string>;
    isFrozen?: Nullable<boolean>;
    createdAt: Date;
    updatedAt: Date;
    followers?: Nullable<Nullable<User>[]>;
    follows?: Nullable<Nullable<User>[]>;
    likes?: Nullable<Nullable<Like>[]>;
    posts?: Nullable<Nullable<Post>[]>;
}

type Nullable<T> = T | null;
