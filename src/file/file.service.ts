import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PhotoEntity } from "src/entities/entity/photo.entity";
import { Repository } from "typeorm";
import * as fs from "fs";
import * as path from "path";

@Injectable()
export class fileService {
  constructor(
    @InjectRepository(PhotoEntity)
    private readonly photoRepository: Repository<PhotoEntity>,
  ) {}

  async uploadPhoto(
    file: Express.Multer.File,
    title?: string,
    description?: string,
  ) {
    if (!file) {
      throw new BadRequestException("No file provided");
    }

    const url = `/uploads/gallery/${file.filename}`;

    const count = await this.photoRepository.count();

    const photo = this.photoRepository.create({
      filename: file.filename,
      originalName: file.originalname,
      title: title || file.originalname.replace(/\.[^.]+$/, ""),
      description: description || "",
      url,
      order: count,
      isVisible: true,
    });

    return this.photoRepository.save(photo);
  }

  async getAllPhotos() {
    return this.photoRepository.find({
      where: { isVisible: true },
      order: { order: "ASC", createdAt: "DESC" },
    });
  }

  async getAllPhotosAdmin() {
    return this.photoRepository.find({
      order: { order: "ASC", createdAt: "DESC" },
    });
  }

  async updatePhoto(
    id: number,
    data: { title?: string; description?: string; order?: number; isVisible?: boolean },
  ) {
    const photo = await this.photoRepository.findOne({ where: { id } });
    if (!photo) throw new NotFoundException("Photo not found");
    Object.assign(photo, data);
    return this.photoRepository.save(photo);
  }

  async deletePhoto(id: number) {
    const photo = await this.photoRepository.findOne({ where: { id } });
    if (!photo) throw new NotFoundException("Photo not found");

    const filePath = path.join(
      process.cwd(),
      "uploads",
      "gallery",
      photo.filename,
    );
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await this.photoRepository.delete(id);
    return { success: true, message: "Photo deleted" };
  }
}
