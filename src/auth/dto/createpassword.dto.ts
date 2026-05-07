import { IsString } from "class-validator";

export class createAdminHashDto {
  @IsString()
  password!: string;
}
