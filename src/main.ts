import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import * as compression from 'compression';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  app.use(helmet());
  app.use(compression({filter: () => { return true }, threshold: 0}));

  const config = new DocumentBuilder()
    .setTitle('Porject OTA API')
    .setDescription('Project OTA API description')
    .setVersion('1.0.0')
    .addTag('flights-api-b2b')
    .addSecurityRequirements('token')
    .addBearerAuth(
      { type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
        name: 'Authorization',
      },'access_token')
    .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('jakuma', app, document);
    await app.listen(8080);
  }
bootstrap();
