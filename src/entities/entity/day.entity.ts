import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { MonthEntity } from "./month.entity";

@Entity("days")
export class DayEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column("int", { nullable: true, default: null })
  price: number;
  @Column()
  date: Date;
  @Column()
  isBooked: boolean;
  @ManyToOne(() => MonthEntity, (month) => month.days)
  month: MonthEntity;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
