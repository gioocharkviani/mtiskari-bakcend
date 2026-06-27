import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DayEntity } from "src/entities/entity/day.entity";
import { Repository } from "typeorm";
import { CalendarDto } from "./dto/calendar.dto";
import { MonthEntity } from "src/entities/entity/month.entity";
import { UpdateDaysDto } from "./dto/updateDay.dto";
import { UpdateMonthDto } from "./dto/updateMonth.dto";

@Injectable()
export class CalendarService {
  constructor(
    @InjectRepository(MonthEntity)
    private readonly monthRepository: Repository<MonthEntity>,

    @InjectRepository(DayEntity)
    private readonly dayRepository: Repository<DayEntity>,
  ) {}

  async getAllCalendarDay(body: CalendarDto) {
    const { year, month, cottageId = 0 } = body;

    if (!year || !month) throw new BadRequestException("Year and month are required");
    if (month < 1 || month > 12) throw new BadRequestException("Month must be between 1 and 12");

    const daysInMonth = new Date(year, month, 0).getDate();
    const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
    const endDate = `${year}-${String(month).padStart(2, "0")}-${String(daysInMonth).padStart(2, "0")}`;

    // Query days directly — avoids relation-loading issues and always returns booked days
    const days = await this.dayRepository
      .createQueryBuilder("day")
      .where("day.date >= :startDate", { startDate })
      .andWhere("day.date <= :endDate", { endDate })
      .andWhere("day.cottageId = :cottageId", { cottageId })
      .getMany();

    // Month record only needed for the base price
    const monthRecord = await this.monthRepository.findOne({
      where: { month, year, cottageId },
    });

    return {
      success: true,
      statusCode: 200,
      message: "Calendar data retrieved successfully",
      data: {
        monthInfo: monthRecord
          ? {
              id: monthRecord.id,
              month: monthRecord.month,
              year: monthRecord.year,
              price: monthRecord.price,
              cottageId: monthRecord.cottageId,
            }
          : null,
        days,
        totalDays: daysInMonth,
        bookedDays: days.filter((d) => d.isBooked).length,
        availableDays: days.filter((d) => !d.isBooked).length,
      },
      total: days.length,
    };
  }

  async changeMonthPrice({ month, year, price, cottageId = 0 }: UpdateMonthDto) {
    if (!month || !year) throw new BadRequestException("Month or Year is required");
    if (price === undefined || price === null) throw new BadRequestException("Price is required");
    if (price < 0) throw new BadRequestException("Price cannot be negative");

    let monthRecord = await this.monthRepository.findOne({ where: { month, year, cottageId } });

    if (!monthRecord) {
      monthRecord = this.monthRepository.create({ price, month, year, cottageId });
    } else {
      monthRecord.price = price;
    }

    const updated = await this.monthRepository.save(monthRecord);

    return {
      success: true,
      statusCode: 200,
      message: "Month price updated successfully",
      data: { id: updated.id, month: updated.month, year: updated.year, price: updated.price, cottageId: updated.cottageId },
    };
  }

  async changeDaysInfo(data: UpdateDaysDto[]) {
    if (data.length === 0) throw new HttpException("Days Data not found", HttpStatus.NO_CONTENT);
    const processedData = await this.getAllReqDays(data);
    return this.dayRepository.save(processedData);
  }

  async deleteDay(id: number) {
    const day = await this.dayRepository.findOne({ where: { id } });
    if (!day) throw new NotFoundException("Day not found");
    if (day.isBooked) throw new BadRequestException("Cannot delete a booked day");
    await this.dayRepository.remove(day);
    return { success: true, message: "Day removed" };
  }

  async cleanupUnpricedDays(cottageId = 0) {
    const result = await this.dayRepository
      .createQueryBuilder("day")
      .delete()
      .where("day.isBooked = :isBooked", { isBooked: false })
      .andWhere("day.isBlocked = :isBlocked", { isBlocked: false })
      .andWhere("(day.price IS NULL OR day.price = 0)")
      .andWhere("day.cottageId = :cottageId", { cottageId })
      .execute();
    return { success: true, deleted: result.affected ?? 0 };
  }

  private async getAllReqDays(data: UpdateDaysDto[]) {
    const newData: DayEntity[] = [];

    for (const DATE of data) {
      const REQUESTDATE = new Date(DATE.date);
      if (REQUESTDATE < new Date()) {
        throw new HttpException("Some date from request is in the past", HttpStatus.BAD_REQUEST);
      }

      const dateString = REQUESTDATE.toISOString().split("T")[0];
      const cottageId = DATE.cottageId ?? 0;

      const existingRecords = await this.dayRepository.find({
        where: { date: dateString, cottageId },
      });

      if (existingRecords.length > 0) {
        newData.push(Object.assign(existingRecords[0], DATE));
      } else {
        const getMonth = REQUESTDATE.getMonth() + 1;
        const getYear = REQUESTDATE.getFullYear();

        let findMonthRecord = await this.monthRepository.findOne({
          where: { month: getMonth, year: getYear, cottageId },
        });

        if (!findMonthRecord) {
          findMonthRecord = await this.monthRepository.save(
            this.monthRepository.create({ month: getMonth, year: getYear, cottageId }),
          );
        }

        newData.push(
          this.dayRepository.create({
            date: dateString,
            price: DATE.price,
            isBooked: DATE.isBooked || false,
            isBlocked: DATE.isBlocked || false,
            month: findMonthRecord?.id,
            cottageId,
          }),
        );
      }
    }

    return newData;
  }
}
