import {
  BadRequestException,
  HttpCode,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DayEntity } from "src/entities/entity/day.entity";
import { Repository } from "typeorm";
import { CalendarDto } from "./dto/calendar.dto";
import { MonthEntity } from "src/entities/entity/month.entity";

@Injectable()
export class CalendarService {
  constructor(
    @InjectRepository(MonthEntity)
    private readonly monthRepo: Repository<MonthEntity>,

    @InjectRepository(DayEntity)
    private readonly dayRepository: Repository<DayEntity>,
  ) {}

  //GET all calendar days for a specific month
  async getAllCalendarDay(body: CalendarDto) {
    const { year, month } = body;

    if (!year || !month) {
      throw new BadRequestException("Year and month are required");
    }

    // Find the month with its days
    const monthData = await this.monthRepo.findOne({
      where: {
        year: year,
        month: month,
      },
      relations: { days: true },
      select: {
        id: true,
        year: true,
        month: true,
        price: true,
        days: {
          id: true,
          date: true,
          isBooked: true,
          price: true,
        },
      },
      order: {
        days: {
          date: "ASC",
        },
      },
    });

    if (!monthData) {
      // You might want to create the month if it doesn't exist, or return empty
      return {
        success: true,
        statusCode: 200,
        data: {
          id: null,
          year: year,
          month: month,
          price: null,
          days: [],
        },
      };
    }

    // If days array exists but might be empty or null
    const formattedData = {
      id: monthData.id,
      year: monthData.year,
      month: monthData.month,
      price: monthData.price,
      days: monthData.days || [],
    };

    return {
      success: true,
      statusCode: 200,
      data: formattedData,
      total: formattedData.days.length,
    };
  }

  //change calendar day or month price
  async updateCalendarDay(dayId: number, updateData: Partial<DayEntity>) {
    const day = await this.dayRepository.find({
      where: { id: dayId },
    });
    if (!day) {
      throw new NotFoundException(`Day with ID ${dayId} not found`);
    }
    Object.assign(day, updateData);
    return await this.dayRepository.save(updateData);
  }
}
