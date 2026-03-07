import { IsNotEmpty, IsNumber } from "class-validator";

export class UpdateMonthDto {
  @IsNumber()
  @IsNotEmpty()
  price: number;
}
