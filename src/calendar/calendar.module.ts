import { Module } from "@nestjs/common";
import { CaldendarController } from "./calendar.controller";
import { CalendarService } from "./calendar.service";
import { EntitiesModule } from "src/entities/entities.module";

@Module({
  imports: [EntitiesModule],
  controllers: [CaldendarController],
  providers: [CalendarService],
})
export class CalendarModeule {}
