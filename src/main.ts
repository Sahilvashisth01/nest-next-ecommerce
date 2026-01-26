import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3001);

  //project description

  app.setGlobalPrefix('api/v1');

}

bootstrap().catch((err) => {
  Logger.error('Error starting server', err);
  process.exit(1);
});
