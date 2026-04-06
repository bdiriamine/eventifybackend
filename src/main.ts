import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.setGlobalPrefix('api');
  
  // ✅ Configuration CORS avec tes URLs spécifiques
  app.enableCors({
    origin: [
      'https://eventify-phi-nine.vercel.app',  // Ton frontend
      'http://localhost:3000',                  // Développement local
      'http://localhost:3001',                  // Alternative
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
    exposedHeaders: ['Authorization'],
  });
  
  app.useGlobalPipes(new ValidationPipe({
    whitelist: false,
    transform: true,
    transformOptions: { enableImplicitConversion: true },
  }));
  
  // Helmet avec configuration CORS-friendly
  app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginOpenerPolicy: { policy: "unsafe-none" },
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