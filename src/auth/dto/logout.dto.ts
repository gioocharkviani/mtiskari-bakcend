import { IsBoolean, IsString } from "class-validator";

export class logOutDto {
  @IsString()
  token?: string;
  @IsString()
  type!: string;
  @IsBoolean()
  isActive?: boolean;
}
