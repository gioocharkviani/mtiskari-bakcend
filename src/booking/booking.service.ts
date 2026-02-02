import {
  ConflictException,
  ExceptionFilter,
  HttpException,
  Injectable,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { bookingEntity } from "src/entities/entity/booking.entity";
import { DayEntity } from "src/entities/entity/day.entity";
import { guestEntity } from "src/entities/entity/guest.entity";
import { MonthEntity } from "src/entities/entity/month.entity";
import { QueryBuilder, Repository } from "typeorm";
import { NewBooking } from "./dto/booking.dto";

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(MonthEntity)
    private readonly monthRepository: Repository<MonthEntity>,

    @InjectRepository(guestEntity)
    private readonly guestRepository: Repository<guestEntity>,

    @InjectRepository(DayEntity)
    private readonly dayRepository: Repository<DayEntity>,

    @InjectRepository(bookingEntity)
    private readonly bookingRepository: Repository<bookingEntity>,
  ) {}

  // HELPER FN FOR CHECK DATES BETWEEN BOOKING DATES
  private getAllNewBookingDays(startDate: Date, endDate: Date): string[] {
    const dates: string[] = [];
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Loop through each date
    const current = new Date(start);
    while (current <= end) {
      const strDate = current.toISOString().split("T")[0];
      dates.push(strDate);
      current.setDate(current.getDate() + 1);
    }
    return dates;
  }

  //NEW BOOKING FN
  async newBooking(newBookingDto: NewBooking) {
    const {
      email,
      phone,
      firstName,
      lastName,
      checkInDate,
      checkOutDate,
      totalPrice,
      guestCount,
    } = newBookingDto;

    // Convert string dates to Date objects
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    // Validate dates
    if (checkIn >= checkOut) {
      throw new ConflictException("Check-out date must be after check-in date");
    }

    //check if guest is in our database
    const guest = await this.guestRepository.findOne({
      where: [{ email: email }, { phone: phone }],
    });
    let guestId: string | undefined;

    // If guest doesn't exist, create new guest
    if (!guest) {
      const newGuest = await this.guestRepository.save({
        email: email,
        phone: phone,
        firstName: firstName,
        lastName: lastName,
      });
      guestId = newGuest.id;
    } else {
      guestId = guest.id;
    }

    //all requested booking days
    const reqBookingDays = this.getAllNewBookingDays(checkIn, checkOut);

    //calculate total totalNights
    const totalNightCalc = reqBookingDays.length - 1;

    // Check all requested booking days status

    reqBookingDays.forEach((i) => {
      this.dayRepository.save({
        date: i,
        isBooked: true,
      });
    });
    //TODO check total price

    const newBooking = {
      checkInDate: checkInDate,
      checkOutDate: checkOutDate,
      guestCount: guestCount,
      guestId: guestId,
      totalNights: totalNightCalc,
      totalPrice: totalPrice,
    };

    return reqBookingDays;
  }
  //NEW BOOKING FN
}
