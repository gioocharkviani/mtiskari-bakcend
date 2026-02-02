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
  @Column({ nullable: false })
  guestId: string;
  @Column({ nullable: false })
  checkInDate: string;
  @Column({ nullable: false })
  checkOutDate: string;
  @Column("int")
  totalNights: number;
  @Column("int")
  guestCount: number;
  @Column("int")
  totalPrice: number;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
  @Column({
    nullable: true,
    type: "enum",
    enum: BookingStatus,
    default: BookingStatus.PENDING,
  })
  bookingStatus: BookingStatus;
}
