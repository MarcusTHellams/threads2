
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export class CreateUserInput {
    exampleField?: Nullable<number>;
}

export class UpdateUserInput {
    id: number;
}

export class User {
    userId: string;
    email: string;
    password: string;
    profilePic?: Nullable<string>;
    bio?: Nullable<string>;
    isFrozen?: Nullable<boolean>;
    createdAt: Date;
    updatedAt: Date;
    followers?: Nullable<Nullable<User>[]>;
    follows?: Nullable<Nullable<User>[]>;
}

export abstract class IQuery {
    abstract users(): Nullable<User>[] | Promise<Nullable<User>[]>;

    abstract user(id: string): Nullable<User> | Promise<Nullable<User>>;
}

export abstract class IMutation {
    abstract createUser(createUserInput: CreateUserInput): User | Promise<User>;

    abstract updateUser(updateUserInput: UpdateUserInput): User | Promise<User>;

    abstract removeUser(id: number): Nullable<User> | Promise<Nullable<User>>;
}

type Nullable<T> = T | null;
