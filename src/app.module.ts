import { Module } from "@nestjs/common";
import { BookingModule } from "./booking/booking.module";
import { DatabaseModule } from "./database/database.module";
import { CalendarModeule } from "./calendar/calendar.module";
import { ConfigModule } from "@nestjs/config";
import { FileModule } from "./file/file.module";
import { EmailController } from "./email/email.controller";
import { EmailModule } from "./email/email.module";
import { ReferenceService } from './reference/reference.service';
import { ReferenceModule } from './reference/reference.module';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';

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
    ReferenceModule,
    AuthModule,
  ],
  controllers: [EmailController, AuthController],
  providers: [ReferenceService],
})
export class AppModule {}
