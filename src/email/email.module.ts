import { Module } from "@nestjs/common";
import { EmailService } from "./email.service";
import { EmailController } from "./email.controller";
import { ConfigModule } from "@nestjs/config";
import { TokenModule } from "src/token/token.module";

@Module({
  imports: [ConfigModule, TokenModule],
  controllers: [EmailController],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
