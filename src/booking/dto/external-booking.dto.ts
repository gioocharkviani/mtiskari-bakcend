import { IsDateString, IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class ExternalBookingDto {
  @IsNotEmpty()
  @IsDateString()
  checkInDate: string;

  @IsNotEmpty()
  @IsDateString()
  checkOutDate: string;

  @IsOptional()
  @IsInt()
  channelId?: number;

  @IsOptional()
  @IsString()
  channelName?: string;

  @IsOptional()
  @IsInt()
  totalPrice?: number;

  @IsOptional()
  @IsInt()
  guestCount?: number;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsInt()
  cottageId?: number;
}
