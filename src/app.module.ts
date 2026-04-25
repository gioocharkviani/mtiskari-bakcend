import { Module } from "@nestjs/common";
import { BookingModule } from "./booking/booking.module";
import { DatabaseModule } from "./database/database.module";
import { CalendarModeule } from "./calendar/calendar.module";
import { ConfigModule } from "@nestjs/config";
import { FileModule } from "./file/file.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    DatabaseModule,
    BookingModule,
    CalendarModeule,
    FileModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
