import { Controller, Get, Post } from "@nestjs/common";
import { BookingService } from "./booking.service";

@Controller("booking")
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  //new Booking
  @Post()
  newBooking() {
    return this.bookingService.newBooking();
  }
}
