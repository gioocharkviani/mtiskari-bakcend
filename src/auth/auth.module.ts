import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { ConfigModule } from "@nestjs/config";
import { EmailModule } from "src/email/email.module";
import { TokenService } from "./token.service";

@Module({
  imports: [ConfigModule, EmailModule],
  providers: [AuthService, TokenService],
  exports: [AuthService, TokenService],
})
export class AuthModule {}
