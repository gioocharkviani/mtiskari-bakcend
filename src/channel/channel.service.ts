import { Injectable, OnModuleInit, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ChannelEntity } from "src/entities/entity/channel.entity";

@Injectable()
export class ChannelService implements OnModuleInit {
  constructor(
    @InjectRepository(ChannelEntity)
    private channelRepo: Repository<ChannelEntity>,
  ) {}

  async onModuleInit() {
    const count = await this.channelRepo.count();
    if (count === 0) {
      await this.channelRepo.save([
        this.channelRepo.create({ name: "Booking.com", color: "#003580", isActive: true }),
        this.channelRepo.create({ name: "Airbnb", color: "#FF5A5F", isActive: true }),
      ]);
    }
  }

  getAll() {
    return this.channelRepo.find({ order: { createdAt: "ASC" } });
  }

  getActive() {
    return this.channelRepo.find({ where: { isActive: true }, order: { createdAt: "ASC" } });
  }

  async getById(id: number) {
    const ch = await this.channelRepo.findOne({ where: { id } });
    if (!ch) throw new NotFoundException("Channel not found");
    return ch;
  }

  create(dto: { name: string; color?: string; isActive?: boolean }) {
    const ch = this.channelRepo.create({
      name: dto.name,
      color: dto.color ?? "#6366f1",
      isActive: dto.isActive ?? true,
    });
    return this.channelRepo.save(ch);
  }

  async update(id: number, dto: { name?: string; color?: string; isActive?: boolean }) {
    const ch = await this.getById(id);
    Object.assign(ch, dto);
    return this.channelRepo.save(ch);
  }

  async remove(id: number) {
    const ch = await this.getById(id);
    await this.channelRepo.remove(ch);
    return { success: true };
  }
}
