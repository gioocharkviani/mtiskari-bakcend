import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { tokenEntity } from "src/entities/entity/token.entity";
import { Repository } from "typeorm";
import { v4 as uuid4 } from "uuid";
import { ConfigService } from "@nestjs/config";
import { tokenInterface } from "src/auth/types/token.interface";

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(tokenEntity)
    private readonly tokenRepository: Repository<tokenEntity>,
    private readonly configService: ConfigService,
  ) {}
  //-------------------------------------------SAVE AUTH TOKEN
  async generateAuthToken() {
    try {
      const generateToken = await this.saveGeneratedToken();
      return generateToken;
    } catch (error) {
      throw new BadRequestException();
    }
  }
  //-------------------------------------------SAVE AUTH TOKEN

  //------------------------------------------VALIDATE AUTH TOKEN
  async validateToken(token: string): Promise<boolean> {
    try {
      const findToken = await this.tokenRepository.findOne({
        where: {
          token: token,
          isActive: true,
        },
      });

      if (!findToken) {
        return false;
      }

      const currentDate = new Date();
      if (currentDate > findToken.expiresAt) {
        await this.tokenRepository.delete(findToken.id);
        return false;
      }
      return true;
    } catch (error) {
      console.error("Token validation error:", error);
      return false;
    }
  }
  //------------------------------------------VALIDATE AUTH TOKEN

  //------------------------------------------REMOVE TOKEN
  async deleteToken(data: tokenInterface) {
    const findToken: tokenEntity | null = await this.tokenRepository.findOne({
      where: {
        token: data?.token,
        isActive: true,
        type: data.type,
      },
    });
    if (findToken) {
      await this.tokenRepository.delete(findToken.id);
      return {
        status: 202,
        message: "token remove successfully",
      };
    }
    return new HttpException("token not found", HttpStatus.NOT_FOUND);
  }
  //------------------------------------------REMOVE TOKEN

  //GENERATE TOKEN
  private async saveGeneratedToken() {
    try {
      const tokenExipredTime = await this.configService.get("ADMIN_TOKEN_TIME");
      const tokenValue = uuid4();
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + parseInt(tokenExipredTime));
      const token = this.tokenRepository.create({
        token: tokenValue,
        expiresAt: expiresAt,
        isActive: true,
        type: "ADMIN",
      });
      await this.tokenRepository.save(token);
      return {
        token: token.token,
      };
    } catch (error) {
      return new HttpException(
        "error duraring generate token",
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  //GENERATE TOKEN
}
