import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CottageEntity } from "src/entities/entity/cottage.entity";
import { CottageService } from "./cottage.service";
import { CottageController } from "./cottage.controller";
import { TokenModule } from "src/token/token.module";

@Module({
  imports: [TypeOrmModule.forFeature([CottageEntity]), TokenModule],
  controllers: [CottageController],
  providers: [CottageService],
  exports: [CottageService],
})
export class CottageModule {}
