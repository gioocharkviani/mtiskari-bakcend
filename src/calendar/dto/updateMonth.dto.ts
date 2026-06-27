import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";

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
  @IsOptional()
  @IsNumber()
  cottageId?: number;
}
