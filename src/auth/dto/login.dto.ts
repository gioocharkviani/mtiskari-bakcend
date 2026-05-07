import { IsString } from "class-validator";

export class adminLoginDto {
  @IsString()
  password!: string;
}
