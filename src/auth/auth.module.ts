import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { ConfigModule } from "@nestjs/config";
import { EmailModule } from "src/email/email.module";

@Module({
  imports: [ConfigModule, EmailModule],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
