import { Body, Controller, Get, Param, Post, Res } from "@nestjs/common";
import { BookingService } from "./booking.service";
import { NewBooking } from "./dto/booking.dto";
import type { Response } from "express";

@Controller("booking")
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  //new Booking
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
}
