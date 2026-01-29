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
    private readonly yearRepository: Repository<MonthEntity>,

    @InjectRepository(DayEntity)
    private readonly dayRepository: Repository<DayEntity>,
  ) {}

  //GET all calendar days
  async getAllCalendarDay(body: CalendarDto) {
    const { year, month } = body;
    if (!year || !month) {
      throw new BadRequestException();
    }
    const res = await this.yearRepository.find({
      where: {
        year: year,
        month: month,
      },
      relations: { days: true },
      select: {
        createdAt: false,
        days: {
          createdAt: false,
          updatedAt: false,
          date: true,
          id: true,
          isBooked: true,
          month: false,
          price: true,
        },
        id: true,
        month: true,
        price: true,
        updatedAt: false,
        year: true,
      },
      order: {
        createdAt: "ASC",
      },
    });
    if (res.length === 0) {
      return {
        success: false,
        satusCode: 204,
        data: res,
      };
    } else
      return {
        success: true,
        statusCode: 200,
        data: res,
        total: res.length,
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
