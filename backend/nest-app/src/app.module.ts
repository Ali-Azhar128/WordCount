import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { MongooseModule } from '@nestjs/mongoose'
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

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', '..', 'frontend', 'public'),
      serveRoot: '/public/',
    }),
    ConfigModule.forRoot(),
    // Todo: Added JWT authentication alongwith guards
    // PassportModule,
    // JwtModule.registerAsync({
    //   imports: [ConfigModule],
    //   useFactory: async (ConfigService: ConfigService) => ({
    //     secret: ConfigService.get<string>('abc123'),
    //     signOptions: { expiresIn: '60m' }
    //   }),
    //   inject: [ConfigService]
    // }),
    ParaModule,
    UsersModule,
    AuthModule,
    MongooseModule.forFeature([{name: Paragraph.name, schema: ParaSchema}]),
    MongooseModule.forFeature([{name: User.name, schema: UserSchema}]),
    MongooseModule.forRoot('mongodb+srv://aliazharmughal128:mongodb1234@cluster0.utyc8hi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'),
    UsersModule,
],
  controllers: [AppController],
  providers: [AppService, NoSpecialCharactersGuard],
})
export class AppModule {}
//providers for jwt: JwtStrategy, JwtAuthGuard,