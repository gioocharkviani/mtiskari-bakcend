import { ConflictException, Injectable } from "@nestjs/common";
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

  //NEW BOOKING FN
  async newBooking(newBookingDto: NewBooking) {
    try {
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

      // Validate and parse dates
      const { checkIn, checkOut } = this.validateDates(
        checkInDate,
        checkOutDate,
      );

      //const new guest
      const guestId = await this.findOrCreateGuest(
        email,
        phone,
        firstName,
        lastName,
      );
      //all requested booking days
      const reqBookingDays = this.getAllNewBookingDays(checkIn, checkOut);
      // Check days avalebility
      await this.checkAvailability(reqBookingDays);

      const newBooking = await this.createBooking(
        checkIn,
        checkOut,
        totalPrice,
        guestId,
        guestCount,
      );

      return newBooking;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new ConflictException(`Booking failed: ${error.message}`);
    }
  }
  //NEW BOOKING FN

  //---------------------------------------------------------------------HELPER FUNCTIONS

  //VALIDATE check-in or out dates
  private validateDates(checkIn: string, checkOut: string) {
    const chIn = new Date(checkIn);
    const chOut = new Date(checkOut);
    const today = new Date();
    if (chIn >= chOut) {
      throw new ConflictException("Check-out date must be after check-in date");
    }
    if (chIn < today) {
      throw new ConflictException("Check-in date cannot be in the past");
    }
    return { checkIn, checkOut };
  }

  //CREATE OR FIND guest
  private async findOrCreateGuest(
    email: string,
    phone: string,
    firstName: string,
    lastName: string,
  ): Promise<string> {
    let guest = await this.guestRepository.findOne({
      where: [{ email }, { phone }],
    });

    if (!guest) {
      guest = this.guestRepository.create({
        email,
        phone,
        firstName,
        lastName,
      });
      guest = await this.guestRepository.save(guest);
    }

    return guest.id;
  }

  // HELPER fn for check all days between booking days
  private getAllNewBookingDays(startDate: string, endDate: string): string[] {
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

  //CHECK IF DAY IS BOOKED
  private async checkAvailability(dates: string[]) {
    const bookedDays = await this.dayRepository
      .createQueryBuilder("day")
      .where("day.date IN (:...dates)", { dates })
      .andWhere("day.isBooked = :isBooked", { isBooked: true })
      .getMany();

    if (bookedDays.length > 0) {
      const bookedDates = bookedDays.map((day) => day.date).join(", ");
      throw new ConflictException(
        `The following dates are already booked: ${bookedDates}`,
      );
    }
  }

  private async createBooking(
    checkIn: string,
    checkOut: string,
    totalPrice: number,
    guestId: string,
    guestCount: number,
  ) {
    const checkBookingDates = await this.bookingRepository
      .createQueryBuilder("date")
      .where("date.checkInDate IN (:checkIn)", { checkIn })
      .andWhere("date.checkOutDate IN (:checkOut)", { checkOut })
      .getMany();

    if (checkBookingDates.length > 0) {
      throw new ConflictException(
        "check in or checkOut date is already booked",
      );
    }
    const reqBookingDays = this.getAllNewBookingDays(checkIn, checkOut);
    await this.saveBookedDay(reqBookingDays);

    //calculate total night
    const totalNight = reqBookingDays.length - 1;

    const newBooking = this.bookingRepository.create({
      checkInDate: checkIn,
      checkOutDate: checkOut,
      totalNights: totalNight,
      guestCount: guestCount,
      guestId: guestId,
      totalPrice: totalPrice,
    });

    return await this.bookingRepository.save(newBooking);
  }

  //save all requested days
  private async saveBookedDay(dates: string[]) {
    const daysToInsert = dates.map((date) => ({
      date,
      isBooked: true,
    }));
    const saveDays = await this.dayRepository
      .createQueryBuilder()
      .insert()
      .into(DayEntity)
      .values(daysToInsert)
      .orIgnore()
      .execute();
    return saveDays;
  }
  //---------------------------------------------------------------------HELPER FUNCTIONS
}
