import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DayEntity } from "./entity/day.entity";
import { MonthEntity } from "./entity/month.entity";
import { guestEntity } from "./entity/guest.entity";
import { bookingEntity } from "./entity/booking.entity";
import { emailEntity } from "./entity/mail.entity";
import { confirmationEntity } from "./entity/confirmation.entity";
import { tokenEntity } from "./entity/token.entity";

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([
      DayEntity,
      MonthEntity,
      guestEntity,
      bookingEntity,
      emailEntity,
      tokenEntity,
      confirmationEntity,
    ]),
  ],
  exports: [TypeOrmModule],
})
export class EntitiesModule {}
