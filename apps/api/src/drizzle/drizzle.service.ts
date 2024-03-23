import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { schema } from 'database';
import { ConfigService } from '@nestjs/config';
import { Client } from 'pg';
import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres';

export type DatabaseClient = NodePgDatabase<typeof schema>;

@Injectable()
export class DrizzleService implements OnModuleInit, OnModuleDestroy {
  private client: Client;
  public db: NodePgDatabase<typeof schema>;
  constructor(private readonly configService: ConfigService) {
    this.client = new Client({
      user: this.configService.get('DATABASE_USER'),
      password: this.configService.get('DATABASE_PASSWORD'),
      host: this.configService.get('DATABASE_HOST'),
      database: this.configService.get('DATABASE_NAME'),
      ssl: true,
    });
    this.db = drizzle(this.client, { schema, logger: true });
  }
  onModuleInit() {
    this.client
      .connect()
      .then(() => console.log('Successfully connected to the Database'));
  }

  onModuleDestroy() {
    this.client
      .end()
      .then(() => console.log('Successfully disconnected from  the Database'));
  }
}
