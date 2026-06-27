import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
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

  @Get()
  getAllCalendarDay(@Query() query) {
    return this.calendarService.getAllCalendarDay({
      month: parseInt(query.month),
      year: parseInt(query.year),
      cottageId: query.cottageId ? parseInt(query.cottageId) : 0,
    });
  }

  @Patch("month")
  @UseGuards(AuthGuard)
  changeMonthPrice(@Body() body: UpdateMonthDto) {
    return this.calendarService.changeMonthPrice(body);
  }

  @Patch("days")
  @UseGuards(AuthGuard)
  changeDaysInfo(@Body() body: UpdateDaysDto[]) {
    return this.calendarService.changeDaysInfo(body);
  }

  @Delete("day/:id")
  @UseGuards(AuthGuard)
  deleteDay(@Param("id", ParseIntPipe) id: number) {
    return this.calendarService.deleteDay(id);
  }

  @Post("cleanup")
  @UseGuards(AuthGuard)
  cleanupUnpricedDays(@Body("cottageId") cottageId?: number) {
    return this.calendarService.cleanupUnpricedDays(cottageId ?? 0);
  }
}
