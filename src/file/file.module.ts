import { Module } from "@nestjs/common";
import { fileController } from "./file.controller";
import { fileService } from "./file.service";
import { TokenModule } from "src/token/token.module";
import { MulterModule } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname } from "path";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PhotoEntity } from "src/entities/entity/photo.entity";
import * as fs from "fs";

const uploadDir = "uploads/gallery";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

@Module({
  imports: [
    TokenModule,
    TypeOrmModule.forFeature([PhotoEntity]),
    MulterModule.register({
      storage: diskStorage({
        destination: "./uploads/gallery",
        filename: (_req, file, cb) => {
          const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
          cb(null, unique + extname(file.originalname));
        },
      }),
      limits: { fileSize: 10 * 1024 * 1024 },
      fileFilter: (_req, file, cb) => {
        if (!file.mimetype.match(/^image\//)) {
          return cb(new Error("Only image files allowed"), false);
        }
        cb(null, true);
      },
    }),
  ],
  controllers: [fileController],
  providers: [fileService],
  exports: [fileService],
})
export class FileModule {}
