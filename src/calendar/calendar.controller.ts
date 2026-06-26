import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from "@nestjs/common";
import { CalendarService } from "./calendar.service";
import { UpdateMonthDto } from "./dto/updateMonth.dto";
import { UpdateDaysDto } from "./dto/updateDay.dto";
import { AuthGuard } from "src/guards/auth.guard";

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

  // Change month price by ID
  @Patch("month")
  @UseGuards(AuthGuard)
  changeMonthPrice(@Body() body: UpdateMonthDto) {
    return this.calendarService.changeMonthPrice(body);
  }

  //Change day info
  @Patch("days")
  @UseGuards(AuthGuard)
  changeDaysInfo(@Body() body: UpdateDaysDto[]) {
    return this.calendarService.changeDaysInfo(body);
  }
}
