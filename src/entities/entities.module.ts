import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DayEntity } from "./entity/day.entity";
import { MonthEntity } from "./entity/month.entity";

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([DayEntity, MonthEntity])],
  exports: [TypeOrmModule],
})
export class EntitiesModule {}
