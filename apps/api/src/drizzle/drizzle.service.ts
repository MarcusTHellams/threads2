import { Injectable } from '@nestjs/common';
import { schema } from 'database';
import { ConfigService } from '@nestjs/config';
import { Client } from 'pg';
import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres';

@Injectable()
export class DrizzleService {
  public db: NodePgDatabase<typeof schema>;
  constructor(private readonly configService: ConfigService) {
    const client = new Client({
      user: this.configService.get('DATABASE_USER'),
      password: this.configService.get('DATABASE_PASSWORD'),
      host: this.configService.get('DATABASE_HOST'),
      database: this.configService.get('DATABASE_NAME'),
      ssl: true,
    });
    client.connect().then(() => console.log('success'));
    this.db = drizzle(client, { schema });
  }
}
