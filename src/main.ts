import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // app.enableCors();
    const corsOrigins = process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',').map(origin => origin.trim()) : [];

    app.enableCors({
        origin: corsOrigins,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    });

    // app.enableCors({
    //     origin: [
    //         'http://localhost:5173',  // Vite
    //         'http://localhost:3000',  // React
    //         'https://vet-chat-bot-integrate-anywhere.vercel.app/',
    //         'https://vet-demo-six.vercel.app/'
    //     ],
    //     methods: ['GET', 'POST', 'PUT', 'DELETE'],
    //     allowedHeaders: ['Content-Type', 'Authorization'],
    //     credentials: true
    // });

    app.setGlobalPrefix('api');

    const port = process.env.PORT || 5000;
    await app.listen(port);
    console.log(`Application is running on: ${port}`);
}
bootstrap();