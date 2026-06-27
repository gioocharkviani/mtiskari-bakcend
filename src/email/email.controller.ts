import { Body, Controller, Post } from "@nestjs/common";
import { EmailService } from "./email.service";
import { emailDto } from "./dto/email.dto";
import { IsNotEmpty, IsOptional, IsString, IsEmail } from "class-validator";

class ContactFormDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsNotEmpty()
  @IsString()
  message: string;
}

@Controller("email")
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post("send")
  async sendEmail(@Body() body: emailDto) {
    return await this.emailService.sendUniversalTemplateEmail(body);
  }

  @Post("contact")
  async contactForm(@Body() body: ContactFormDto) {
    return await this.emailService.sendContactForm(body);
  }
}
