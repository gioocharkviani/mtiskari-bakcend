import { Module } from "@nestjs/common";
import { CaldendarController } from "./calendar.controller";
import { CalendarService } from "./calendar.service";
import { EntitiesModule } from "src/entities/entities.module";
import { TokenModule } from "src/token/token.module";

@Module({
  imports: [EntitiesModule, TokenModule],
  controllers: [CaldendarController],
  providers: [CalendarService],
})
export class CalendarModeule {}
