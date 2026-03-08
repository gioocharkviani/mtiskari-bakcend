import { Type } from "class-transformer";
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";

export class UpdateDaysDto {
  @IsOptional()
  @IsString()
  date: string;

  @IsOptional()
  @IsNumber()
  price: number;

  @IsOptional()
  @IsBoolean()
  isBooked: boolean;

  @IsOptional()
  @IsBoolean()
  isBlocked: boolean;
}

export class UpdateDaysDtoArr {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateDaysDto)
  days: UpdateDaysDto[];
}
