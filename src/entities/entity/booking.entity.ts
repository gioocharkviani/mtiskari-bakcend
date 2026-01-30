import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

export enum BookingStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  CANCELLED = "CANCELLED",
  COMPLETED = "COMPLETED",
  REJECTED = "REJECTED",
  REFUNDED = "REFUNDED",
}

@Entity("booking")
export class bookingEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column("int", { nullable: false })
  userId: number;
  @Column("date", { nullable: false })
  checkInDate: Date;
  @Column("date", { nullable: false })
  checkOutDate: Date;
  @Column("int")
  totalNights: number;
  @Column("int")
  totalPrice: number;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
  @Column({ type: "enum", enum: BookingStatus, default: BookingStatus.PENDING })
  bookingStatus: BookingStatus;
}
