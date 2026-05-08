import { Body, Controller, Post, Req, Res, UseGuards } from "@nestjs/common";
import { adminLoginDto } from "./dto/login.dto";
import { AuthService } from "./auth.service";
import { createAdminHashDto } from "./dto/createpassword.dto";
import type { Request, Response } from "express";
import { ConfigService } from "@nestjs/config";
import { AuthGuard } from "src/guards/auth.guard";
import { getCookie } from "src/utils/cookes";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  //-------------------------------------------ADMIN SIGN IN
  @Post("admin-signIn")
  async adminLogin(
    @Body() body: adminLoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token: any = await this.authService.adminSignIn(body);
    const MAXAGE = await this.configService.get("ADMIN_TOKEN_TIME");
    res.cookie("byAt", token.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: MAXAGE * 60 * 60 * 1000,
      path: "/",
    });

    return token;
  }
  //-------------------------------------------ADMIN SIGN IN

  //-------------------------------------------ADMIN SIGN OUT
  @Post("admin-signOut")
  @UseGuards(AuthGuard)
  async adminSignOut(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token: any = getCookie(req.headers.cookie, "byAt");

    await this.authService.adminSignOut({
      token: token,
      type: "ADMIN",
      isActive: true,
    });

    res.clearCookie("byAt", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    return {
      success: true,
      message: "Logout successful",
    };
  }
  //-------------------------------------------ADMIN SIGN OUT

  @Post("create-admin-password")
  async createAdminPasswordHash(@Body() body: createAdminHashDto) {
    return await this.authService.createAdminPasswordHash(body);
  }
}
