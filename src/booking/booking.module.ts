import { Module } from "@nestjs/common";
import { BookingController } from "./booking.controller";
import { BookingService } from "./booking.service";
import { CalendarModeule } from "src/calendar/calendar.module";
import { EntitiesModule } from "src/entities/entities.module";
import { EmailModule } from "src/email/email.module";
import { ReferenceModule } from "src/reference/reference.module";
import { TokenModule } from "src/token/token.module";

@Module({
  imports: [
    CalendarModeule,
    EntitiesModule,
    EmailModule,
    ReferenceModule,
    TokenModule,
  ],
  controllers: [BookingController],
  providers: [BookingService],
})
export class BookingModule {}
