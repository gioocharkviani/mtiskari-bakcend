import { Module } from "@nestjs/common";
import { BookingController } from "./booking.controller";
import { BookingService } from "./booking.service";
import { CalendarModeule } from "src/calendar/calendar.module";
import { EntitiesModule } from "src/entities/entities.module";
import { EmailModule } from "src/email/email.module";
import { ReferenceModule } from "src/reference/reference.module";
import { TokenService } from "src/auth/token.service";

@Module({
  imports: [CalendarModeule, EntitiesModule, EmailModule, ReferenceModule],
  controllers: [BookingController],
  providers: [BookingService, TokenService],
})
export class BookingModule {}
