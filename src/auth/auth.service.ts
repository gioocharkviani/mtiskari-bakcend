import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as bcrypt from "bcrypt";
import { EmailService } from "src/email/email.service";
import { createAdminHashDto } from "./dto/createpassword.dto";
import { adminLoginDto } from "./dto/login.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
  ) {}

  //-----------------------------------------------admin login
  async adminSignIn(data: adminLoginDto) {
    const ADMIN_HASH = await this.configService.get("ADMIN_HASH");
    const comparePassword = await bcrypt.compare(data.password, ADMIN_HASH);
    return comparePassword;
  }
  //-----------------------------------------------admin login

  //-------------------------------------------------create amin password hash
  async createAdminPasswordHash(data: createAdminHashDto) {
    const ADMIN_HASH = await this.configService.get("ADMIN_HASH");
    const ADMIN = await this.configService.get("EMAIL_USER");
    const SALT = await this.configService.get("ADMIN_SALT");
    if (ADMIN_HASH) {
      await this.emailService.sendUniversalTemplateEmail({
        recipients: [ADMIN],
        subject: "ADMIN HASH PASSWORD",
        html: "<b>you have pasword already in configuration folder you can contact developer to repair your password</b>",
      });
      return "you have  password allready";
    }
    try {
      const hash = await bcrypt.hash(data.password, parseInt(SALT));
      console.log(hash);
      await this.emailService.sendUniversalTemplateEmail({
        recipients: [ADMIN],
        subject: "ADMIN HASH PASSWORD",
        html: `<b>${hash}</b>`,
      });
      return "ADMIN PASSWORD SENT seccessfully TO ADMIN EMAIL";
    } catch (error) {
      throw new HttpException(
        "error during creating password",
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  //-------------------------------------------------create amin password hash
}
