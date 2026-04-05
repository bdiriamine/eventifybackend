// main.ts - Ajoutez ces lignes au tout début
import * as dns from 'dns';
dns.setServers(['1.1.1.1', '8.8.8.8']); // Cloudflare DNS et Google DNS

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  // Vérification du DNS (optionnel)
  console.log('🔧 DNS Servers:', dns.getServers());
  
  const app = await NestFactory.create(AppModule);
  
  app.setGlobalPrefix('api');
  
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });
  
  app.useGlobalPipes(new ValidationPipe({
    whitelist: false,
    transform: true,
    transformOptions: { enableImplicitConversion: true },
  }));
  
  const config = new DocumentBuilder()
    .setTitle('Eventify Tunisia API')
    .setDescription('API for Event Planning Platform')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  
  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`🚀 Eventify API running on http://localhost:${port}/api`);
  console.log(`📚 Swagger docs: http://localhost:${port}/api/docs`);
}

bootstrap();