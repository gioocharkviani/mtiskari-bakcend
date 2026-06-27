import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { CottageService, CreateCottageDto, UpdateCottageDto } from "./cottage.service";
import { AuthGuard } from "src/guards/auth.guard";
import { IsBoolean, IsInt, IsOptional, IsString, Min } from "class-validator";
import { Transform } from "class-transformer";

class CreateDto implements CreateCottageDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Transform(({ value }) => (value !== undefined ? parseInt(value) : undefined))
  maxGuests?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => (value !== undefined ? parseInt(value) : undefined))
  order?: number;
}

class UpdateDto implements UpdateCottageDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  maxGuests?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsInt()
  order?: number;
}

@Controller("cottage")
export class CottageController {
  constructor(private readonly cottageService: CottageService) {}

  @Get()
  getActive() {
    return this.cottageService.getActive();
  }

  @Get("admin")
  @UseGuards(AuthGuard)
  getAll() {
    return this.cottageService.getAll();
  }

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() body: CreateDto) {
    return this.cottageService.create(body);
  }

  @Patch(":id")
  @UseGuards(AuthGuard)
  update(@Param("id", ParseIntPipe) id: number, @Body() body: UpdateDto) {
    return this.cottageService.update(id, body);
  }

  @Delete(":id")
  @UseGuards(AuthGuard)
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.cottageService.remove(id);
  }
}
