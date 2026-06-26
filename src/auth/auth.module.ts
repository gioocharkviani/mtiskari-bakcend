import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { ConfigModule } from "@nestjs/config";
import { EmailModule } from "src/email/email.module";
import { TokenModule } from "src/token/token.module";

@Module({
  imports: [ConfigModule, EmailModule, TokenModule],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
