import { Module } from "@nestjs/common";
import { BookingModule } from "./booking/booking.module";
import { DatabaseModule } from "./database/database.module";
import { CalendarModeule } from "./calendar/calendar.module";

@Module({
  imports: [DatabaseModule, BookingModule, CalendarModeule],
  controllers: [],
  providers: [],
})
export class AppModule {}
