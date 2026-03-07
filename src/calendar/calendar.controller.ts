import { Body, Controller, Get, Param, Patch, Query } from "@nestjs/common";
import { CalendarService } from "./calendar.service";
import { CalendarDto } from "./dto/calendar.dto";
import { UpdateMonthDto } from "./dto/updateMonth.dto";

@Controller("calendar")
export class CaldendarController {
  constructor(private readonly calendarService: CalendarService) {}
  //get all calendar days
  @Get()
  getAllCalendarDay(@Query() query: CalendarDto) {
    return this.calendarService.getAllCalendarDay(query);
  }

  // Change month price by ID
  @Patch("month/:id")
  changeMonthPrice(@Param("id") id: number, @Body() body: UpdateMonthDto) {
    return this.calendarService.changeMonthPrice(id, body.price);
  }
}
