import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { TokenService } from "src/auth/token.service";
import { getCookie } from "src/utils/cookes";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private tokenService: TokenService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = getCookie(request.headers.cookie, "byAt");

    if (!token) {
      throw new UnauthorizedException("token not provided");
    }

    const isValid = await this.tokenService.validateToken(token);
    if (!isValid) {
      throw new UnauthorizedException("token is invalid");
    }
    return true;
  }
}
