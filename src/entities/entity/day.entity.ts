import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from "typeorm";
import { MonthEntity } from "./month.entity";

@Entity("days")
@Unique(["date", "cottageId"])
export class DayEntity {
  @PrimaryGeneratedColumn()
  id?: number;
  @Column("int", { nullable: true, default: null })
  price?: number;
  @Column("date", { nullable: false })
  date?: string;
  @Column({ default: false })
  isBooked?: boolean;
  @ManyToOne(() => MonthEntity, (month) => month.id)
  month?: number;
  @Column({ default: false })
  isBlocked?: boolean;
  @Column({ type: "int", nullable: false, default: 0 })
  cottageId?: number;
  @CreateDateColumn({ nullable: true })
  createdAt?: Date;
  @UpdateDateColumn({ nullable: true })
  updatedAt?: Date;
}
