import { Body, Controller, Get, Patch, UseGuards } from "@nestjs/common";
import { ContentService } from "./content.service";
import { AuthGuard } from "src/guards/auth.guard";
import { IsArray, IsOptional, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

class ContentItemDto {
  @IsString()
  key!: string;

  @IsOptional()
  @IsString()
  en?: string;

  @IsOptional()
  @IsString()
  ka?: string;
}

class BulkUpdateDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContentItemDto)
  items!: ContentItemDto[];
}

@Controller("content")
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Get()
  getAll() {
    return this.contentService.getAll();
  }

  @Patch()
  @UseGuards(AuthGuard)
  bulkUpdate(@Body() body: BulkUpdateDto) {
    return this.contentService.bulkUpdate(body.items);
  }
}
