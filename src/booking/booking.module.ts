import { Module } from "@nestjs/common";
import { BookingController } from "./booking.controller";
import { BookingService } from "./booking.service";
import { CalendarModeule } from "src/calendar/calendar.module";
import { EntitiesModule } from "src/entities/entities.module";

@Module({
  imports: [CalendarModeule, EntitiesModule],
  controllers: [BookingController],
  providers: [BookingService],
})
export class BookingModule {}
