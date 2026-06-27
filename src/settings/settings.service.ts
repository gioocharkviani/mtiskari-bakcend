import { Injectable, OnModuleInit } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AppSettingEntity } from "src/entities/entity/app-setting.entity";

const DEFAULTS: Record<string, string> = {
  multi_cottage_mode: "false",
};

@Injectable()
export class SettingsService implements OnModuleInit {
  constructor(
    @InjectRepository(AppSettingEntity)
    private settingRepo: Repository<AppSettingEntity>,
  ) {}

  async onModuleInit() {
    for (const [key, value] of Object.entries(DEFAULTS)) {
      const exists = await this.settingRepo.findOne({ where: { key } });
      if (!exists) {
        await this.settingRepo.save(this.settingRepo.create({ key, value }));
      }
    }
  }

  async getAll(): Promise<Record<string, string>> {
    const rows = await this.settingRepo.find();
    return Object.fromEntries(rows.map((r) => [r.key, r.value]));
  }

  async get(key: string): Promise<string | null> {
    const row = await this.settingRepo.findOne({ where: { key } });
    return row?.value ?? null;
  }

  async set(key: string, value: string): Promise<Record<string, string>> {
    let row = await this.settingRepo.findOne({ where: { key } });
    if (row) {
      row.value = value;
    } else {
      row = this.settingRepo.create({ key, value });
    }
    await this.settingRepo.save(row);
    return this.getAll();
  }

  async bulkSet(updates: { key: string; value: string }[]): Promise<Record<string, string>> {
    for (const { key, value } of updates) {
      await this.set(key, value);
    }
    return this.getAll();
  }
}
