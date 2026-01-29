import { Controller, Get, Query } from "@nestjs/common";
import { CalendarService } from "./calendar.service";
import { CalendarDto } from "./dto/calendar.dto";

@Controller("calendar")
export class CaldendarController {
  constructor(private readonly calendarService: CalendarService) {}
  //get all calendar days
  @Get()
  getAllCalendarDay(@Query() query: CalendarDto) {
    return this.calendarService.getAllCalendarDay(query);
  }
}
