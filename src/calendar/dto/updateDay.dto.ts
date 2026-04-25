import {
  IsBoolean,
  IsDateString,
  isNumber,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";

export class UpdateDaysDto {
  @IsString()
  date!: string;
  @IsOptional()
  @IsNumber()
  price?: number;
  @IsOptional()
  @IsBoolean()
  isBooked?: boolean;
  @IsOptional()
  @IsBoolean()
  isBlocked?: boolean;
  @IsOptional()
  @IsNumber()
  monthId?: number;
}
