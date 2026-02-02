import { Body, Controller, Get, Post } from "@nestjs/common";
import { BookingService } from "./booking.service";
import { NewBooking } from "./dto/booking.dto";

@Controller("booking")
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  //new Booking
  @Post("new")
  newBooking(@Body() newBookingDto: NewBooking) {
    return this.bookingService.newBooking(newBookingDto);
  }
}
