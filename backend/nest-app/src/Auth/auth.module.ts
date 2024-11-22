import { Module } from "@nestjs/common";
import { UsersModule } from "../users/users.module.js";
import { AuthController } from "./auth.controller.js";
import { AuthService } from "./auth.service.js";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";

@Module({
    imports: [
        UsersModule,
        JwtModule.register({
            global: true,
            secret: 'abc123',
            signOptions: { expiresIn: '30d' },
          }),
    ],
    controllers: [AuthController],
    providers: [AuthService]
})

export class AuthModule {}