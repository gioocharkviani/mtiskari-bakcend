import { Module } from "@nestjs/common";
import { ContentController } from "./content.controller";
import { ContentService } from "./content.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ContentEntity } from "src/entities/entity/content.entity";
import { TokenModule } from "src/token/token.module";

@Module({
  imports: [TypeOrmModule.forFeature([ContentEntity]), TokenModule],
  controllers: [ContentController],
  providers: [ContentService],
  exports: [ContentService],
})
export class ContentModule {}
