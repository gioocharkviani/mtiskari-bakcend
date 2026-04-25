import { Module } from "@nestjs/common";
import { fileController } from "./file.controller";
import { fileService } from "./file.service";

@Module({
  controllers: [fileController],
  providers: [fileService],
  exports: [],
})
export class FileModule {}
