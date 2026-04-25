import { IsNotEmpty, IsNumber } from "class-validator";

export class UpdateMonthDto {
  @IsNumber()
  @IsNotEmpty()
  price?: number;
  @IsNumber()
  @IsNotEmpty()
  month?: number;
  @IsNumber()
  @IsNotEmpty()
  year?: number;
}
