import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FeatureCardEntity } from "src/entities/entity/feature-card.entity";
import { FeatureCardService } from "./feature-card.service";
import { FeatureCardController } from "./feature-card.controller";
import { TokenModule } from "src/token/token.module";

@Module({
  imports: [TypeOrmModule.forFeature([FeatureCardEntity]), TokenModule],
  providers: [FeatureCardService],
  controllers: [FeatureCardController],
  exports: [FeatureCardService],
})
export class FeatureCardModule {}
