import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { BookingService } from "./booking.service";
import { NewBooking } from "./dto/booking.dto";
import { UpdateStatusDto } from "./dto/updateStatus.dto";
import { ExternalBookingDto } from "./dto/external-booking.dto";
import { UpdatePaymentDto } from "./dto/update-payment.dto";
import type { Request, Response } from "express";
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

  @Get("check-ip")
  checkIp(@Req() req: Request) {
    return req;
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

  @Post("admin/external")
  @UseGuards(AuthGuard)
  createExternalBooking(@Body() body: ExternalBookingDto) {
    return this.bookingService.createExternalBooking(body);
  }

  @Patch(":id/payment")
  @UseGuards(AuthGuard)
  updatePayment(
    @Param("id", ParseIntPipe) id: number,
    @Body() body: UpdatePaymentDto,
  ) {
    return this.bookingService.updatePayment(id, body);
  }
}
