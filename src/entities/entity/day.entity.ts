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
  @Column("date", { nullable: false, unique: true })
  date: string;
  @Column()
  isBooked: boolean;
  @ManyToOne(() => MonthEntity, (month) => month.id)
  month: number;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
