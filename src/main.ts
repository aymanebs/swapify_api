import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [process.env.FRONT_URL],
    methods: ['GET', 'POST', 'OPTIONS', 'DELETE', 'PUT', 'PATCH'],
    credentials: true,
  });

  
  const config = new DocumentBuilder()
    .setTitle('Swapify API')
    .setDescription('API documentation for Swapify, an online platform for exchanging goods without currency.')
    .setVersion('1.0')
    .addBearerAuth() 
    .addTag('auth', 'Authentication endpoints')
    .addTag('categories', 'Category management endpoints')
    .addTag('chats', 'Chat management endpoints')
    .addTag('items', 'Item management endpoints')
    .addTag('messages', 'Message management endpoints')
    .addTag('ratings', 'Rating management endpoints')
    .addTag('requests', 'Request management endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
