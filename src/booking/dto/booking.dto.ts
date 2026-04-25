import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
} from "class-validator";

export class NewBooking {
  @IsNotEmpty()
  @IsString()
  firstName?: string;
  @IsNotEmpty()
  @IsString()
  lastName?: string;
  @IsNotEmpty()
  @IsString()
  phone?: string;
  @IsNotEmpty()
  @IsNumber()
  totalPrice?: number;
  @IsNotEmpty()
  @IsNumber()
  guestCount?: number;
  @IsNotEmpty()
  @IsEmail()
  email?: string;
  @IsNotEmpty()
  @IsDateString()
  checkInDate?: string;
  @IsNotEmpty()
  @IsDateString()
  checkOutDate?: string;
}
