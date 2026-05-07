import { Body, Controller, Post } from "@nestjs/common";
import { adminLoginDto } from "./dto/login.dto";
import { AuthService } from "./auth.service";
import { createAdminHashDto } from "./dto/createpassword.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("admin-signIn")
  async adminLogin(@Body() body: adminLoginDto) {
    return await this.authService.adminSignIn(body);
  }

  @Post("create-admin-password")
  async createAdminPasswordHash(@Body() body: createAdminHashDto) {
    return await this.authService.createAdminPasswordHash(body);
  }
}
