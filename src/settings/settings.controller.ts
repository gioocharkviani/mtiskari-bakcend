import { Body, Controller, Get, Patch, UseGuards } from "@nestjs/common";
import { SettingsService } from "./settings.service";
import { AuthGuard } from "src/guards/auth.guard";
import { IsArray, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

class SettingItemDto {
  @IsString()
  key: string;

  @IsString()
  value: string;
}

class BulkSettingsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SettingItemDto)
  items: SettingItemDto[];
}

@Controller("settings")
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  getAll() {
    return this.settingsService.getAll();
  }

  @Patch()
  @UseGuards(AuthGuard)
  bulkSet(@Body() body: BulkSettingsDto) {
    return this.settingsService.bulkSet(body.items);
  }
}
