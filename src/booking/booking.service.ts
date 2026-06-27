import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { bookingEntity, BookingStatus, PaymentStatus, PaymentType } from "src/entities/entity/booking.entity";
import { DayEntity } from "src/entities/entity/day.entity";
import { guestEntity } from "src/entities/entity/guest.entity";
import { Repository } from "typeorm";
import { NewBooking } from "./dto/booking.dto";
import { ExternalBookingDto } from "./dto/external-booking.dto";
import { UpdatePaymentDto } from "./dto/update-payment.dto";
import { MonthEntity } from "src/entities/entity/month.entity";
import { EmailService } from "src/email/email.service";
import { ReferenceService } from "src/reference/reference.service";
import { confirmationEntity } from "src/entities/entity/confirmation.entity";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class BookingService {
  private readonly logger = new Logger("logger");
  constructor(
    @InjectRepository(MonthEntity)
    private readonly monthRepository: Repository<MonthEntity>,

    @InjectRepository(guestEntity)
    private readonly guestRepository: Repository<guestEntity>,

    @InjectRepository(DayEntity)
    private readonly dayRepository: Repository<DayEntity>,

    @InjectRepository(bookingEntity)
    private readonly bookingRepository: Repository<bookingEntity>,

    @InjectRepository(confirmationEntity)
    private readonly confirmationRepository: Repository<confirmationEntity>,

    private readonly emailService: EmailService,
    private readonly referenceService: ReferenceService,
    private readonly configService: ConfigService,
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
        cottageId,
      } = newBookingDto;

      const { checkIn, checkOut } = this.validateDates(checkInDate, checkOutDate);
      const guestId = await this.findOrCreateGuest(email, phone, firstName, lastName);
      const reqBookingDays = this.getAllNewBookingDays(checkIn, checkOut);
      const cId = cottageId ?? 0;
      await this.checkAvailability(reqBookingDays, cId);
      const reference: string = this.referenceService.generateUniqueReferences()[0];
      const newBooking = await this.createBooking(checkIn, checkOut, totalPrice, guestId, guestCount, reference, cId);
      this.logger.log(
        `new booking created by ${guestId} : checkIn ${checkIn} , checkOut:${checkOut}`,
      );

      const CONFIRMATION_TOKEN = this.referenceService.generateReference(
        "MT",
        63,
      );

      const createConfirmation = await this.confirmationRepository.create({
        token: CONFIRMATION_TOKEN,
      });
      await this.confirmationRepository.save(createConfirmation);

      const bookingData = {
        customerName: firstName,
        customerEmail: email,
        customerPhone: phone,
        reference: reference,
        totalAmount: totalPrice,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        duration: "",
        confirmBookingUrl:
          this.configService.get("BOOKING_CONFIRM_URL") +
          CONFIRMATION_TOKEN +
          `/${newBooking.id}`,
      };
      await this.emailService.sendBookingNotificationToAdmin(bookingData);

      return newBooking;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new ConflictException(`Booking failed`);
    }
  }
  //NEW BOOKING FN

  //---------------------------------------------------------------------BOOKING CONFIRMATION
  async bookingConfirmation(token: string, id: string) {
    const BookingIdToint: number = parseInt(id);

    // Validate parameters first
    if (!token || !id) {
      throw new BadRequestException("token OR booking Id not found");
    }

    const findBooking = await this.bookingRepository.findOne({
      where: {
        id: BookingIdToint,
      },
    });

    const findToken = await this.confirmationRepository.findOne({
      where: {
        token: token,
      },
    });

    if (!findBooking) {
      throw new BadRequestException("Booking not found");
    }

    if (!findToken) {
      throw new BadRequestException("Invalid token");
    }

    const guest = await this.guestRepository.findOne({
      where: {
        id: findBooking.guestId,
      },
    });

    console.log(guest);

    if (!guest) {
      throw new BadRequestException("Guest not found");
    }

    try {
      await this.bookingRepository.update(
        { id: BookingIdToint },
        { bookingStatus: BookingStatus.CONFIRMED },
      );
      await this.confirmationRepository.delete(findToken.id);

      const confirmationMailData = {
        customerName: guest.firstName || "",
        reference: findBooking.reference,
        bookingStatus: "CONFIRMED",
        checkInDate: findBooking.checkInDate || "",
        checkInTime: await this.configService.get("CHECK_IN_TIME"),
        checkOutDate: findBooking.checkOutDate || "",
        checkOutTime: await this.configService.get("CHECK_OUT_TIME"),
        duration: `${findBooking.totalNights || 0} nights`,
        bookingDetails: "",
        totalAmount: findBooking.totalPrice,
        customerEmail: guest.email,
      };
      await this.emailService.sendBookingConfirmationToCustomer(
        confirmationMailData,
      );
      return {
        success: true,
        message: "Booking confirmed successfully",
        bookingId: id,
      };
    } catch (error) {
      throw new InternalServerErrorException("Failed to confirm booking");
    }
  }
  //---------------------------------------------------------------------BOOKING CONFIRMATION

  //---------------------------------------------------------------------ADMIN: GET ALL BOOKINGS
  async getAllBookings() {
    const bookings = await this.bookingRepository.find({
      order: { createdAt: "DESC" },
    });

    const result = await Promise.all(
      bookings.map(async (booking) => {
        const guest = await this.guestRepository.findOne({
          where: { id: booking.guestId },
        });
        return { ...booking, guest };
      }),
    );

    return { success: true, data: result, total: result.length };
  }
  //---------------------------------------------------------------------ADMIN: GET ALL BOOKINGS

  //---------------------------------------------------------------------ADMIN: GET SINGLE BOOKING
  async getBookingById(id: number) {
    const booking = await this.bookingRepository.findOne({ where: { id } });
    if (!booking) throw new BadRequestException("Booking not found");
    const guest = await this.guestRepository.findOne({
      where: { id: booking.guestId },
    });
    return { success: true, data: { ...booking, guest } };
  }
  //---------------------------------------------------------------------ADMIN: GET SINGLE BOOKING

  //---------------------------------------------------------------------ADMIN: UPDATE BOOKING STATUS
  async updateBookingStatus(id: number, status: BookingStatus) {
    const booking = await this.bookingRepository.findOne({ where: { id } });
    if (!booking) throw new BadRequestException("Booking not found");

    await this.bookingRepository.update({ id }, { bookingStatus: status });

    const freedStatuses = [
      BookingStatus.CANCELLED,
      BookingStatus.REJECTED,
      BookingStatus.REFUNDED,
    ];
    if (freedStatuses.includes(status) && booking.checkInDate && booking.checkOutDate) {
      const days = this.getAllNewBookingDays(booking.checkInDate, booking.checkOutDate);
      const cottageId = booking.cottageId ?? 0;
      if (days.length > 0) {
        await this.dayRepository
          .createQueryBuilder()
          .update(DayEntity)
          .set({ isBooked: false })
          .where("date IN (:...dates)", { dates: days })
          .andWhere("cottageId = :cottageId", { cottageId })
          .execute();
      }
    }

    return { success: true, message: `Booking status updated to ${status}` };
  }
  //---------------------------------------------------------------------ADMIN: UPDATE BOOKING STATUS

  //---------------------------------------------------------------------ADMIN: STATS
  async getStats() {
    const total = await this.bookingRepository.count();
    const confirmed = await this.bookingRepository.count({
      where: { bookingStatus: BookingStatus.CONFIRMED },
    });
    const pending = await this.bookingRepository.count({
      where: { bookingStatus: BookingStatus.PENDING },
    });
    const cancelled = await this.bookingRepository.count({
      where: { bookingStatus: BookingStatus.CANCELLED },
    });

    const revenueResult = await this.bookingRepository
      .createQueryBuilder("b")
      .select("SUM(b.totalPrice)", "total")
      .where("b.bookingStatus IN (:...statuses)", {
        statuses: [BookingStatus.CONFIRMED, BookingStatus.COMPLETED],
      })
      .getRawOne();

    const totalRevenue = parseInt(revenueResult?.total || "0");
    const totalGuests = await this.guestRepository.count();

    const upcoming = await this.bookingRepository
      .createQueryBuilder("b")
      .where("b.checkInDate >= :today", {
        today: new Date().toISOString().split("T")[0],
      })
      .andWhere("b.bookingStatus = :status", {
        status: BookingStatus.CONFIRMED,
      })
      .getCount();

    return {
      success: true,
      data: { total, confirmed, pending, cancelled, totalRevenue, totalGuests, upcoming },
    };
  }
  //---------------------------------------------------------------------ADMIN: STATS

  //---------------------------------------------------------------------ADMIN: EXTERNAL (CHANNEL) BOOKING
  async createExternalBooking(dto: ExternalBookingDto) {
    const { checkInDate, checkOutDate, channelId, channelName, totalPrice, guestCount, cottageId } = dto;

    const { checkIn, checkOut } = this.validateDates(checkInDate, checkOutDate);
    const reqBookingDays = this.getAllNewBookingDays(checkIn, checkOut);
    const cId = cottageId ?? 0;
    await this.checkAvailability(reqBookingDays, cId);

    let guestId: number | undefined;
    if (dto.email) {
      guestId = await this.findOrCreateGuest(dto.email, dto.phone, dto.firstName, dto.lastName);
    }

    await this.saveBookedDay(reqBookingDays, cId);

    const totalNight = reqBookingDays.length;
    const reference = this.referenceService.generateReference("EXT", 8);

    const booking = this.bookingRepository.create({
      checkInDate: checkIn,
      checkOutDate: checkOut,
      totalNights: totalNight,
      guestCount: guestCount ?? 1,
      guestId: guestId ?? 0,
      totalPrice: totalPrice ?? 0,
      reference,
      bookingStatus: BookingStatus.CONFIRMED,
      channelId: channelId ?? undefined,
      channelName: channelName ?? undefined,
      cottageId: cottageId ?? null,
      paymentStatus: PaymentStatus.UNPAID,
    });

    return this.bookingRepository.save(booking);
  }
  //---------------------------------------------------------------------ADMIN: EXTERNAL (CHANNEL) BOOKING

  //---------------------------------------------------------------------ADMIN: UPDATE PAYMENT
  async updatePayment(id: number, dto: UpdatePaymentDto) {
    const booking = await this.bookingRepository.findOne({ where: { id } });
    if (!booking) throw new BadRequestException("Booking not found");
    if (dto.paymentStatus !== undefined) booking.paymentStatus = dto.paymentStatus;
    if (dto.paymentType !== undefined) booking.paymentType = dto.paymentType;
    await this.bookingRepository.save(booking);
    return { success: true, message: "Payment info updated" };
  }
  //---------------------------------------------------------------------ADMIN: UPDATE PAYMENT

  //---------------------------------------------------------------------CHANGE BOOKING INFO
  async changeBookingInfo() {}
  //---------------------------------------------------------------------CHANGE BOOKING INFO

  //---------------------------------------------------------------------HELPER FUNCTIONS

  //VALIDATE check-in or out dates
  private validateDates(checkIn?: string, checkOut?: string) {
    const chIn = new Date(checkIn || "");
    const chOut = new Date(checkOut || "");
    const isToday = new Date();
    if (chIn >= chOut) {
      throw new ConflictException("Check-out date must be after check-in date");
    } else if (chIn < isToday) {
      throw new ConflictException("Check-in date cannot be in the past");
    }
    return { checkIn, checkOut };
  }

  //CREATE OR FIND guest
  private async findOrCreateGuest(
    email?: string,
    phone?: string,
    firstName?: string,
    lastName?: string,
  ): Promise<number> {
    let guest = await this.guestRepository.findOne({
      where: [{ email }],
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
  private getAllNewBookingDays(startDate?: string, endDate?: string): string[] {
    const dates: string[] = [];
    const start = new Date(startDate || "");
    const end = new Date(endDate || "");
    end.setDate(end.getDate() - 1);
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
  private async checkAvailability(dates: string[], cottageId = 0) {
    const bookedDays = await this.dayRepository
      .createQueryBuilder("day")
      .where("day.date IN (:...dates)", { dates })
      .andWhere("day.isBooked = :isBooked", { isBooked: true })
      .andWhere("day.cottageId = :cottageId", { cottageId })
      .getMany();

    if (bookedDays.length > 0) {
      const bookedDates = bookedDays.map((day) => day.date).join(", ");
      throw new ConflictException(
        `The following dates are already booked: ${bookedDates}`,
      );
    }
  }

  //CREATE NEW BOOKING
  private async createBooking(
    checkIn?: string,
    checkOut?: string,
    totalPrice?: number,
    guestId?: number,
    guestCount?: number,
    reference?: string,
    cottageId = 0,
  ) {
    const reqBookingDays = this.getAllNewBookingDays(checkIn, checkOut);
    await this.saveBookedDay(reqBookingDays, cottageId);

    const totalNight = reqBookingDays.length - 1;

    const newBooking = this.bookingRepository.create({
      checkInDate: checkIn,
      checkOutDate: checkOut,
      totalNights: totalNight,
      guestCount,
      guestId,
      totalPrice,
      reference,
      cottageId: cottageId > 0 ? cottageId : null,
    });

    return await this.bookingRepository.save(newBooking);
  }

  //save all requested days with month associations
  private async saveBookedDay(dates: string[], cottageId = 0): Promise<void> {
    const monthCache = new Map<string, number>();

    for (const dateStr of dates) {
      const date = new Date(dateStr);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const monthKey = `${year}-${month}-${cottageId}`;
      let monthId = monthCache.get(monthKey);

      if (!monthId) {
        let monthRecord = await this.monthRepository.findOne({
          where: { year, month, cottageId },
        });
        if (!monthRecord) {
          monthRecord = await this.monthRepository.save(
            this.monthRepository.create({ year, month, cottageId }),
          );
        }
        monthId = monthRecord.id;
        monthCache.set(monthKey, monthId);
      }

      // Upsert: update isBooked=true if record exists, otherwise insert.
      // This fixes the bug where orIgnore() left cancelled days unblocked after rebooking.
      const existing = await this.dayRepository.findOne({ where: { date: dateStr, cottageId } });
      if (existing) {
        await this.dayRepository.update({ id: existing.id }, { isBooked: true });
      } else {
        await this.dayRepository.save(
          this.dayRepository.create({ date: dateStr, isBooked: true, month: monthId, cottageId }),
        );
      }
    }
  }
  //---------------------------------------------------------------------HELPER FUNCTIONS
}
