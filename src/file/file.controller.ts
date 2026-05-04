import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { fileService } from "./file.service";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller("file")
export class fileController {
  constructor(private readonly fileService: fileService) {}

  @Post("uploadGallery")
  @UseInterceptors(FileInterceptor("image"))
  async uplaodPhoto(@UploadedFile() image: any) {
    console.log(image);
    return this.fileService.photoUpload();
  }
}
