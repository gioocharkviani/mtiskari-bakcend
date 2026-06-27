import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { DayEntity } from "./day.entity";
import { Max, Min } from "class-validator";

@Entity("month")
export class MonthEntity {
  @PrimaryGeneratedColumn()
  id!: number;
  @Column("int")
  @Min(1)
  @Max(12)
  month!: number;
  @Column("int", { nullable: true, default: null })
  price?: number;
  @Column("int")
  year?: number;
  @Column({ type: "int", nullable: false, default: 0 })
  cottageId?: number;
  @OneToMany(() => DayEntity, (day) => day.month)
  days?: DayEntity[];
  @CreateDateColumn()
  createdAt?: Date;
  @UpdateDateColumn()
  updatedAt?: Date;
}
