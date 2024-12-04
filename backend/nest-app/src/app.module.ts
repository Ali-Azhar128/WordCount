import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { MongooseModule } from '@nestjs/mongoose';
import { ParaModule } from './Paragraph/para.module.js';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './Auth/jwt/jwt.strategy';
import { JwtAuthGuard } from './Auth/jwt/jwt-auth.guard';
import { NoSpecialCharactersGuard } from './Paragraph/Guards/no-special-char-guard.guard.js';
import { ServeStaticModule } from '@nestjs/serve-static';
import { dirname, join } from 'path';
import { Paragraph, ParaSchema } from './Paragraph/para.schema.js';
import { fileURLToPath } from 'url';
import { UsersModule } from './users/users.module.js';
import { User, UserSchema } from './users/users.schema.js';
import { AuthModule } from './Auth/auth.module.js';
import { constants } from './Constants/constants.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', '..', 'frontend', 'public'),
      serveRoot: '/public/',
    }),

    // for serving frontend build folder
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', '..', 'frontend/dist'),
      serveRoot: '/', // Path to the frontend build folder
    }),
    ConfigModule.forRoot(),
    ParaModule,
    UsersModule,
    AuthModule,
    MongooseModule.forFeature([{ name: Paragraph.name, schema: ParaSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forRoot(constants.databaseUrl),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService, NoSpecialCharactersGuard],
})
export class AppModule {}
