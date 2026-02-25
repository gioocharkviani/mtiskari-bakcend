import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DayEntity } from "src/entities/entity/day.entity";
import { Repository, Between } from "typeorm";
import { CalendarDto } from "./dto/calendar.dto";
import { MonthEntity } from "src/entities/entity/month.entity";

@Injectable()
export class CalendarService {
  constructor(
    @InjectRepository(MonthEntity)
    private readonly monthRepository: Repository<MonthEntity>,

    @InjectRepository(DayEntity)
    private readonly dayRepository: Repository<DayEntity>,
  ) {}

  //GET all calendar days for a specific month
  async getAllCalendarDay(body: CalendarDto) {
    try {
      const { year, month } = body;

      // Validate input
      if (!year || !month) {
        throw new BadRequestException("Year and month are required");
      }

      if (month < 1 || month > 12) {
        throw new BadRequestException("Month must be between 1 and 12");
      }

      // Calculate month start and end dates
      const startDateOfMonth = new Date(year, month - 1, 1);
      const endDateOfMonth = new Date(year, month, 0);

      // Find the month record
      const monthRecord = await this.monthRepository.findOne({
        where: {
          month: month,
          year: year,
        },
        relations: {
          days: true,
        },
        select: {
          id: true,
          month: true,
          year: true,
          price: true,
          days: {
            id: true,
            date: true,
            price: true,
            isBooked: true,
          },
        },
      });

      // If no month record exists, return empty data structure
      if (!monthRecord) {
        return {
          success: true,
          statusCode: 200,
          message: "No data found for this month",
          data: {
            monthInfo: null,
            days: [],
            totalDays: 0,
          },
          total: 0,
        };
      }

      const totalDaysInMonth = endDateOfMonth.getDate();

      return {
        success: true,
        statusCode: 200,
        message: "Calendar data retrieved successfully",
        data: {
          monthInfo: {
            id: monthRecord.id,
            month: monthRecord.month,
            year: monthRecord.year,
            price: monthRecord.price,
          },
          days: monthRecord.days || [],
          totalDays: totalDaysInMonth,
          bookedDays:
            monthRecord.days?.filter((day) => day.isBooked).length || 0,
          availableDays:
            monthRecord.days?.filter((day) => !day.isBooked).length || 0,
        },
        total: monthRecord.days?.length || 0,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      console.error("Error in getAllCalendarDay:", error);
      throw new BadRequestException(
        error.message || "Failed to retrieve calendar data",
      );
    }
  }
}
