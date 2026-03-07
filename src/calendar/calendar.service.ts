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
            isBlocked: true,
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

  // Change month price
  async changeMonthPrice(id: number, price: number) {
    try {
      if (!id) {
        throw new BadRequestException("Month ID is required");
      }

      if (price === undefined || price === null) {
        throw new BadRequestException("Price is required");
      }

      if (price < 0) {
        throw new BadRequestException("Price cannot be negative");
      }

      const month = await this.monthRepository.findOne({
        where: { id },
      });

      if (!month) {
        throw new NotFoundException(`Month with ID ${id} not found`);
      }

      month.price = price;

      const updatedMonth = await this.monthRepository.save(month);

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
      throw new BadRequestException(
        error.message || "Failed to update month price",
      );
    }
  }

  //change each days info price or status
  async changeDaysInfo(id?: number, price?: number, isBlocked?: boolean) {
    //TODO აქ იქნება შემდეგნაირი ლოგიკა რექვესთში იქნება მასივი სადაც იქნება დღეები ობჯექთში და შემოწმდება თითოეული დღე და თუ დღეს ფასი ან რაიმე სტატუსი  ისეთი ექნება რომელიც დეფოლტათ აქვს ის დღე არ შეინახება დანარჩენები შეინახება. ასევე თუ დღე უკვე დაჯავშნილია მოხდება შემდეგნაირი ცხვლილება მასზე .  თუ დაჯავშნილია და ჯავშანი გაუქმდა ასევე უნდა წაიშალოს ის დღეები ბაზიდან ასევე გასუფთავდეს ჯავშანი . წაიშალოს ან შეეცვალოს სტატუსი . ასევე დღეებზე წაიშალოს ან შეიცვალოს ბუქინგის სტატუსი.
    //TODO ასევე შევქმნათ მეილის ფუნქციონალი მომხმარებლისთვის და ასევე სასტუმროს მფლობელისთვის რომ გაიგოს ჯავშნის შესახებ
    //TODO ყველა საჭირო ui ელემენტის ცვლილება ადმინიდან ფოტოების სერვისი გალერიისთვის ბექგრაუნდის კონტროლი , და სხვადასხვა ღონისძიებების დამატება .
    //TODO ავტორიზაციის ფორმა ადმინისთვის რადგან სხვამ ვერ შეძლოს რაიმე ცვლილებების შეტანა საიტის ბექში.
    //TODO დაცული როუტების დამატება და ქორსებით დაცვა ბექის.
  }
}
