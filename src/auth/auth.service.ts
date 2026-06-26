import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as bcrypt from "bcrypt";
import { EmailService } from "src/email/email.service";
import { createAdminHashDto } from "./dto/createpassword.dto";
import { adminLoginDto } from "./dto/login.dto";

import { logOutDto } from "./dto/logout.dto";
import { TokenService } from "src/token/token.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly tokenService: TokenService,
    private readonly emailService: EmailService,
  ) {}

  //-----------------------------------------------admin login
  async adminSignIn(data: adminLoginDto) {
    try {
      const ADMIN_HASH = await this.configService.get("ADMIN_HASH");
      const comparePassword = await bcrypt.compare(data.password, ADMIN_HASH);
      if (!comparePassword) {
        return new UnauthorizedException();
      }
      const token = await this.tokenService.generateAuthToken();
      return token;
    } catch (error) {
      throw new BadRequestException();
    }
  }
  //-----------------------------------------------admin login

  //---------------------------------------------- admin sign out
  async adminSignOut(body: logOutDto) {
    try {
      await this.tokenService.deleteToken({
        token: body.token,
        isActive: true,
        type: "ADMIN",
      });
      return {
        success: true,
        message: "Logout successful.",
      };
    } catch (error) {
      throw new HttpException("Error during logout", HttpStatus.BAD_REQUEST);
    }
  }
  //---------------------------------------------- admin sign out

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
