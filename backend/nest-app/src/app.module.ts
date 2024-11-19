import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose'
import { ParaModule } from './Paragraph/para.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './Auth/jwt/jwt.strategy';
import { JwtAuthGuard } from './Auth/jwt/jwt-auth.guard';
import { NoSpecialCharactersGuard } from './Paragraph/Guards/no-special-char-guard.guard';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { Paragraph, ParaSchema } from './Paragraph/para.schema';

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
    MongooseModule.forFeature([{name: Paragraph.name, schema: ParaSchema}]),
    MongooseModule.forRoot('mongodb+srv://aliazharmughal128:mongodb1234@cluster0.utyc8hi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'),
],
  controllers: [AppController],
  providers: [AppService, NoSpecialCharactersGuard],
})
export class AppModule {}
//providers for jwt: JwtStrategy, JwtAuthGuard,