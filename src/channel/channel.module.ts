import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChannelEntity } from "src/entities/entity/channel.entity";
import { ChannelService } from "./channel.service";
import { ChannelController } from "./channel.controller";
import { TokenModule } from "src/token/token.module";

@Module({
  imports: [TypeOrmModule.forFeature([ChannelEntity]), TokenModule],
  controllers: [ChannelController],
  providers: [ChannelService],
  exports: [ChannelService],
})
export class ChannelModule {}
