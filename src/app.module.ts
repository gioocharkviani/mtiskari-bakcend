import { Module } from "@nestjs/common";
import { BookingModule } from "./booking/booking.module";
import { DatabaseModule } from "./database/database.module";
import { CalendarModeule } from "./calendar/calendar.module";
import { ConfigModule } from "@nestjs/config";
import { FileModule } from "./file/file.module";
import { EmailController } from "./email/email.controller";
import { EmailModule } from "./email/email.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    BookingModule,
    CalendarModeule,
    FileModule,
    EmailModule,
  ],
  controllers: [EmailController],
  providers: [],
})
export class AppModule {}
