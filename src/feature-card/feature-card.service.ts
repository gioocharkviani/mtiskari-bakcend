import { Injectable, NotFoundException, OnModuleInit } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { FeatureCardEntity } from "src/entities/entity/feature-card.entity";

export class FeatureCardDto {
  titleEn?: string;
  titleKa?: string;
  icon?: string;
  itemsEn?: string[];
  itemsKa?: string[];
  isVisible?: boolean;
  order?: number;
}

const SEED_CARDS = [
  {
    titleEn: "Rooms",
    titleKa: "ოთახები",
    icon: "bed",
    itemsEn: ["2 Bedrooms", "Kitchen", "Bathroom", "Balcony"],
    itemsKa: ["2 საძინებელი", "სამზარეულო", "აბაზანა", "აივანი"],
    isVisible: true,
    order: 0,
  },
  {
    titleEn: "Amenities",
    titleKa: "კომფორტი",
    icon: "snowflake",
    itemsEn: ["Air Conditioning", "Heating", "Mountain View", "All Season Access"],
    itemsKa: ["კონდიციონერი", "გათბობა", "მთის ხედი", "ყოველი სეზონი"],
    isVisible: true,
    order: 1,
  },
  {
    titleEn: "Nature",
    titleKa: "ბუნება",
    icon: "mountain",
    itemsEn: ["Mountain View", "Forest Access", "Fresh Air", "Peaceful Environment"],
    itemsKa: ["მთის ხედი", "ტყეზე გასვლა", "სუფთა ჰაერი", "მშვიდი გარემო"],
    isVisible: true,
    order: 2,
  },
];

@Injectable()
export class FeatureCardService implements OnModuleInit {
  constructor(
    @InjectRepository(FeatureCardEntity)
    private repo: Repository<FeatureCardEntity>,
  ) {}

  async onModuleInit() {
    const count = await this.repo.count();
    if (count === 0) {
      for (const card of SEED_CARDS) {
        await this.repo.save(this.repo.create(card));
      }
    }
  }

  getVisible() {
    return this.repo.find({ where: { isVisible: true }, order: { order: "ASC", createdAt: "ASC" } });
  }

  getAll() {
    return this.repo.find({ order: { order: "ASC", createdAt: "ASC" } });
  }

  async getById(id: number) {
    const card = await this.repo.findOne({ where: { id } });
    if (!card) throw new NotFoundException("Feature card not found");
    return card;
  }

  create(dto: FeatureCardDto) {
    return this.repo.save(
      this.repo.create({
        titleEn: dto.titleEn ?? "",
        titleKa: dto.titleKa ?? "",
        icon: dto.icon ?? "star",
        itemsEn: dto.itemsEn ?? [],
        itemsKa: dto.itemsKa ?? [],
        isVisible: dto.isVisible ?? true,
        order: dto.order ?? 0,
      }),
    );
  }

  async update(id: number, dto: FeatureCardDto) {
    const card = await this.getById(id);
    Object.assign(card, dto);
    return this.repo.save(card);
  }

  async remove(id: number) {
    const card = await this.getById(id);
    await this.repo.remove(card);
    return { success: true };
  }
}
