import { Injectable, OnModuleInit, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CottageEntity } from "src/entities/entity/cottage.entity";

export class CreateCottageDto {
  name: string;
  description?: string;
  maxGuests?: number;
  isActive?: boolean;
  order?: number;
}

export class UpdateCottageDto {
  name?: string;
  description?: string;
  maxGuests?: number;
  isActive?: boolean;
  order?: number;
}

@Injectable()
export class CottageService implements OnModuleInit {
  constructor(
    @InjectRepository(CottageEntity)
    private cottageRepo: Repository<CottageEntity>,
  ) {}

  async onModuleInit() {
    const count = await this.cottageRepo.count();
    if (count === 0) {
      await this.cottageRepo.save(
        this.cottageRepo.create({
          name: "Mtiskari Cottage",
          description: "A charming mountain cottage surrounded by nature in the heart of Racha.",
          maxGuests: 8,
          isActive: true,
          order: 0,
        }),
      );
    }
  }

  getActive() {
    return this.cottageRepo.find({
      where: { isActive: true },
      order: { order: "ASC", createdAt: "ASC" },
    });
  }

  getAll() {
    return this.cottageRepo.find({ order: { order: "ASC", createdAt: "ASC" } });
  }

  async getById(id: number) {
    const cottage = await this.cottageRepo.findOne({ where: { id } });
    if (!cottage) throw new NotFoundException("Cottage not found");
    return cottage;
  }

  create(dto: CreateCottageDto) {
    const cottage = this.cottageRepo.create({
      name: dto.name,
      description: dto.description,
      maxGuests: dto.maxGuests ?? 4,
      isActive: dto.isActive ?? true,
      order: dto.order ?? 0,
    });
    return this.cottageRepo.save(cottage);
  }

  async update(id: number, dto: UpdateCottageDto) {
    const cottage = await this.getById(id);
    Object.assign(cottage, dto);
    return this.cottageRepo.save(cottage);
  }

  async remove(id: number) {
    const cottage = await this.getById(id);
    await this.cottageRepo.remove(cottage);
    return { success: true };
  }
}
