import { IsEnum } from "class-validator";
import { BookingStatus } from "src/entities/entity/booking.entity";

export class UpdateStatusDto {
  @IsEnum(BookingStatus)
  status!: BookingStatus;
}
