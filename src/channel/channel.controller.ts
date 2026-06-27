import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from "@nestjs/common";
import { ChannelService } from "./channel.service";
import { AuthGuard } from "src/guards/auth.guard";
import { IsBoolean, IsOptional, IsString } from "class-validator";

class CreateChannelDto {
  @IsString() name: string;
  @IsOptional() @IsString() color?: string;
  @IsOptional() @IsBoolean() isActive?: boolean;
}

class UpdateChannelDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() color?: string;
  @IsOptional() @IsBoolean() isActive?: boolean;
}

@Controller("channel")
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  @Get()
  getActive() { return this.channelService.getActive(); }

  @Get("all")
  @UseGuards(AuthGuard)
  getAll() { return this.channelService.getAll(); }

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() body: CreateChannelDto) { return this.channelService.create(body); }

  @Patch(":id")
  @UseGuards(AuthGuard)
  update(@Param("id", ParseIntPipe) id: number, @Body() body: UpdateChannelDto) {
    return this.channelService.update(id, body);
  }

  @Delete(":id")
  @UseGuards(AuthGuard)
  remove(@Param("id", ParseIntPipe) id: number) { return this.channelService.remove(id); }
}
