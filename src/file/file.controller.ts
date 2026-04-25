import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { fileService } from "./file.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { Request } from "express";

@Controller("file")
export class fileController {
  constructor(private readonly fileService: fileService) {}

  @Post("uploadGallery")
  @UseInterceptors(FileInterceptor("file"))
  async uplaodPhoto(@UploadedFile() file: any) {
    console.log(file);
    return this.fileService.photoUpload();
  }
}
