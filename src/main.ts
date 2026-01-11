import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // app.enableCors();

    app.enableCors({
    origin: [
      'http://localhost:5173',  // Vite
      'http://localhost:3000',  // React
      'https://vet-chat-bot-integrate-anywhere.vercel.app/'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  });

    app.setGlobalPrefix('api');

    const port = process.env.PORT || 5000;
    await app.listen(port);
    console.log(`Application is running on: ${port}`);
}
bootstrap();