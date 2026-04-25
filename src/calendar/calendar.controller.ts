import { Body, Controller, Get, Param, Patch, Query } from "@nestjs/common";
import { CalendarService } from "./calendar.service";
import { CalendarDto } from "./dto/calendar.dto";
import { UpdateMonthDto } from "./dto/updateMonth.dto";
import { UpdateDaysDto } from "./dto/updateDay.dto";

@Controller("calendar")
export class CaldendarController {
  constructor(private readonly calendarService: CalendarService) {}
  //get all calendar days
  @Get()
  getAllCalendarDay(@Query() query) {
    const body = {
      month: parseInt(query.month),
      year: parseInt(query.year),
    };
    return this.calendarService.getAllCalendarDay(body);
  }

  //TODO add auth role guard
  // Change month price by ID
  @Patch("month")
  changeMonthPrice(@Body() body: UpdateMonthDto) {
    return this.calendarService.changeMonthPrice(body);
  }

  //TODO add auth role guard
  //Change day info
  @Patch("days")
  changeDaysInfo(@Body() body: UpdateDaysDto[]) {
    return this.calendarService.changeDaysInfo(body);
  }
}
