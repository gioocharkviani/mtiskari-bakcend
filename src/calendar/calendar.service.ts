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
import { STATUS_CODES } from "http";

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
          days: true,
        },
      });

      // If no month record exists, return empty data structure
      if (!monthRecord) {
        return {
          status: true,
          statusCode: 400,
          message: "Calendar data not found",
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
          days: monthRecord.days,
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
      throw new BadRequestException("Failed to retrieve calendar data");
    }
  }

  // ------------------------------------------------   CHANGE MOTNH INFO
  async changeMonthPrice({ month, year, price }: UpdateMonthDto) {
    try {
      if (!month || !year) {
        throw new BadRequestException("Month or Year is required");
      }

      if (price === undefined || price === null) {
        throw new BadRequestException("Price is required");
      }

      if (price < 0) {
        throw new BadRequestException("Price cannot be negative");
      }

      const MONTH = await this.monthRepository.findOne({
        where: {
          month: month,
          year: year,
        },
      });

      if (!MONTH) {
        const saveMonthRecord = this.monthRepository.create({
          price: price,
          month: month,
          year: year,
        });

        return this.monthRepository.save(saveMonthRecord);
      }

      MONTH.price = price;

      const updatedMonth = await this.monthRepository.save(MONTH);

      return {
        success: true,
        statusCode: 200,
        message: "Month price updated successfully",
        data: {
          id: updatedMonth.id,
          month: updatedMonth.month,
          year: updatedMonth.year,
          price: updatedMonth.price,
        },
      };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      console.error("Error in changeMonthPrice:", error);
      throw new BadRequestException("Failed to update month price");
    }
  }

  // --------------------------------------------------- DAYS INFO CHANGE
  async changeDaysInfo(data: UpdateDaysDto[]) {
    try {
      if (data.length == 0) {
        throw new HttpException("Days Data not found", HttpStatus.NO_CONTENT);
      }
      const processedData: DayEntity[] = await this.getAllReqDays(data);
      const saveData = await this.dayRepository.save(processedData);
      return saveData;
    } catch (error) {
      return error;
    }
  }
  //---------------------------------------------------HELPER FUNCTIONS---------------

  private async getAllReqDays(data: UpdateDaysDto[]) {
    const newData: DayEntity[] = [];

    for (let index = 0; index <= data.length - 1; index++) {
      const DATE: UpdateDaysDto = data[index];
      const NOWDATE = new Date();
      const REQUESTDATE = new Date(data[index].date);
      if (REQUESTDATE < NOWDATE) {
        throw new HttpException(
          "some date from request is pass",
          HttpStatus.BAD_REQUEST,
        );
      }
      const dateString = new Date(data[index].date).toISOString().split("T")[0];
      const existingRecords = await this.dayRepository.find({
        where: { date: dateString },
      });

      if (existingRecords.length > 0) {
        const updatedRecord = Object.assign(existingRecords[0], data[index]);
        newData.push(updatedRecord);
      } else {
        const day: string = data[index].date;
        const getMonth = new Date(day).getMonth() + 1;
        const getYear = new Date(day).getFullYear();

        let findMonthRecord = await this.monthRepository.findOne({
          where: {
            month: getMonth,
            year: getYear,
          },
        });

        if (!findMonthRecord) {
          findMonthRecord = await this.monthRepository.save({
            month: getMonth,
            year: getYear,
          });
        }

        // Create a new DayEntity instance and set the month relation properly
        const newDay = this.dayRepository.create({
          date: dateString,
          price: DATE.price,
          isBooked: DATE.isBooked || false,
          isBlocked: DATE.isBlocked || false,
          month: findMonthRecord?.id,
        });

        newData.push(newDay);
      }
    }
    return newData;
  }
}
