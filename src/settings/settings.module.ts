import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppSettingEntity } from "src/entities/entity/app-setting.entity";
import { SettingsService } from "./settings.service";
import { SettingsController } from "./settings.controller";
import { TokenModule } from "src/token/token.module";

@Module({
  imports: [TypeOrmModule.forFeature([AppSettingEntity]), TokenModule],
  controllers: [SettingsController],
  providers: [SettingsService],
  exports: [SettingsService],
})
export class SettingsModule {}
