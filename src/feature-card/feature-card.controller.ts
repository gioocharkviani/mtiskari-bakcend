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
import { FeatureCardService, FeatureCardDto } from "./feature-card.service";
import { AuthGuard } from "src/guards/auth.guard";

@Controller("feature-card")
export class FeatureCardController {
  constructor(private readonly service: FeatureCardService) {}

  @Get()
  getVisible() {
    return this.service.getVisible();
  }

  @Get("admin")
  @UseGuards(AuthGuard)
  getAll() {
    return this.service.getAll();
  }

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() body: FeatureCardDto) {
    return this.service.create(body);
  }

  @Patch(":id")
  @UseGuards(AuthGuard)
  update(@Param("id", ParseIntPipe) id: number, @Body() body: FeatureCardDto) {
    return this.service.update(id, body);
  }

  @Delete(":id")
  @UseGuards(AuthGuard)
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
