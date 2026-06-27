import { Column, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("app_setting")
export class AppSettingEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  key: string;

  @Column({ type: "text" })
  value: string;

  @UpdateDateColumn()
  updatedAt: Date;
}
