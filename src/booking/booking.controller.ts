import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Res,
  UseGuards,
} from "@nestjs/common";
import { BookingService } from "./booking.service";
import { NewBooking } from "./dto/booking.dto";
import { UpdateStatusDto } from "./dto/updateStatus.dto";
import type { Response } from "express";
import { AuthGuard } from "src/guards/auth.guard";

@Controller("booking")
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post("new")
  newBooking(@Body() newBookingDto: NewBooking) {
    return this.bookingService.newBooking(newBookingDto);
  }

  @Get("confirm/:token/:id")
  async bookingConfirmation(
    @Param("token") token: string,
    @Param("id") id: string,
    @Res() res: Response,
  ) {
    await this.bookingService.bookingConfirmation(token, id);
    res.redirect("https://mtiskari.vercel.app/");
  }

  // Admin endpoints
  @Get("stats")
  @UseGuards(AuthGuard)
  getStats() {
    return this.bookingService.getStats();
  }

  @Get("all")
  @UseGuards(AuthGuard)
  getAllBookings() {
    return this.bookingService.getAllBookings();
  }

  @Get(":id")
  @UseGuards(AuthGuard)
  getBookingById(@Param("id", ParseIntPipe) id: number) {
    return this.bookingService.getBookingById(id);
  }

  @Patch(":id/status")
  @UseGuards(AuthGuard)
  updateBookingStatus(
    @Param("id", ParseIntPipe) id: number,
    @Body() body: UpdateStatusDto,
  ) {
    return this.bookingService.updateBookingStatus(id, body.status);
  }
}
