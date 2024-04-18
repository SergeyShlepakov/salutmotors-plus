import { NestFactory } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
ConfigModule.forRoot();

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(3000);
}
bootstrap();
