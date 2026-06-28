import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("feature_card")
export class FeatureCardEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: "" })
  titleEn: string;

  @Column({ default: "" })
  titleKa: string;

  @Column({ default: "star" })
  icon: string;

  @Column({ type: "json", default: "[]" })
  itemsEn: string[];

  @Column({ type: "json", default: "[]" })
  itemsKa: string[];

  @Column({ default: true })
  isVisible: boolean;

  @Column({ default: 0 })
  order: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
