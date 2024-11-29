import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    exceptionFactory: (validationErrors: ValidationError[] = []) => {
      const errors = validationErrors.map(error => ({
        field: error.property,
        errors: Object.values(error.constraints),
      }));
      return new BadRequestException(errors);
    },
  }));
  const corsOptions: CorsOptions = {
    origin: 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  };

  

  app.enableCors(corsOptions);
  app.use(cookieParser());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
