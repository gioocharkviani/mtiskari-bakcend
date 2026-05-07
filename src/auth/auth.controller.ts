import { Body, Controller, Post } from "@nestjs/common";
import { adminLoginDto } from "./dto/login.dto";

@Controller("auth")
export class AuthController {
  @Post("login")
  async adminLogin(@Body() body: adminLoginDto) {
    return body;
  }
}
