import { IsEnum, IsOptional } from "class-validator";
import { PaymentStatus, PaymentType } from "src/entities/entity/booking.entity";

export class UpdatePaymentDto {
  @IsOptional()
  @IsEnum(PaymentStatus)
  paymentStatus?: PaymentStatus;

  @IsOptional()
  @IsEnum(PaymentType)
  paymentType?: PaymentType;
}
