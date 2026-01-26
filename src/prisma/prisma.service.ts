import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL,
    });
    super({
      adapter,
      log:
        process.env.NODE_ENV === 'development'
          ? ['query', 'error', 'warn']
          : ['error'],
    });
  }

  // Connect to the database when the module is initialized
  async onModuleInit() {
    await this.$connect();
    console.log('Database connected Successfully');
  }

  // Disconnect from the database when the module is destroyed
  async onModuleDestroy() {
    await this.$disconnect();
    console.log('Database disconnected');
  }

  // Utility method to clean the database (for testing purposes)
  async cleanDatabase() {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Cannot clean database in production environment');
    }
    const model = Reflect.ownKeys(this).filter(
      (key) => typeof key === 'string' && !key.startsWith('_'),
    );

    return Promise.all(
      model.map((modelKey) => {
        if (typeof modelKey === 'string') {
          return this[modelKey].deleteMany();
        }
      }),
    );
  }
}
