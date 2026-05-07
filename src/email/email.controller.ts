import { Body, Controller, Post } from "@nestjs/common";
import { EmailService } from "./email.service";
import { emailDto } from "./dto/email.dto";

@Controller("email")
export class EmailController {
  constructor(private readonly emailService: EmailService) {}
  //SEND EMAIL
  @Post("send")
  async sendEmail(@Body() body: emailDto) {
    return await this.emailService.sendUniversalTemplateEmail(body);
  }
}
