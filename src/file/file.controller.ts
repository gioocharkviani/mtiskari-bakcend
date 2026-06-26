import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { fileService } from "./file.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { AuthGuard } from "src/guards/auth.guard";
import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";
import { Transform } from "class-transformer";

class UpdatePhotoDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (value !== undefined && value !== null ? parseInt(value) : undefined))
  order?: number;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === undefined || value === null) return undefined;
    return value === true || value === "true";
  })
  isVisible?: boolean;
}

@Controller("file")
export class fileController {
  constructor(private readonly fileService: fileService) {}

  @Get("gallery")
  getGallery() {
    return this.fileService.getAllPhotos();
  }

  @Get("gallery/admin")
  @UseGuards(AuthGuard)
  getGalleryAdmin() {
    return this.fileService.getAllPhotosAdmin();
  }

  @Post("uploadGallery")
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor("image"))
  async uploadPhoto(
    @UploadedFile() file: Express.Multer.File,
    @Body("title") title?: string,
    @Body("description") description?: string,
  ) {
    return this.fileService.uploadPhoto(file, title, description);
  }

  @Patch("gallery/:id")
  @UseGuards(AuthGuard)
  async updatePhoto(
    @Param("id", ParseIntPipe) id: number,
    @Body() body: UpdatePhotoDto,
  ) {
    return this.fileService.updatePhoto(id, body);
  }

  @Delete("gallery/:id")
  @UseGuards(AuthGuard)
  async deletePhoto(@Param("id", ParseIntPipe) id: number) {
    return this.fileService.deletePhoto(id);
  }
}
