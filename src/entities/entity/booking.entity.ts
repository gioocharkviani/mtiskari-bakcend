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

export enum PaymentStatus {
  UNPAID = "UNPAID",
  PAID = "PAID",
  PARTIALLY_PAID = "PARTIALLY_PAID",
}

export enum PaymentType {
  CASH = "CASH",
  CARD = "CARD",
  BANK_TRANSFER = "BANK_TRANSFER",
}

@Entity("booking")
export class bookingEntity {
  @PrimaryGeneratedColumn()
  id?: number;
  @Column({ nullable: true })
  reference?: string;
  @Column({ nullable: true })
  guestId!: number;

  @Column({ nullable: true, type: "int" })
  cottageId?: number | null;

  @Column({ nullable: true, type: "int" })
  channelId?: number | null;

  @Column({ nullable: true })
  channelName?: string;

  @Column({
    nullable: true,
    type: "enum",
    enum: PaymentStatus,
    default: PaymentStatus.UNPAID,
  })
  paymentStatus?: PaymentStatus;

  @Column({ nullable: true, type: "enum", enum: PaymentType })
  paymentType?: PaymentType;
  @Column({ nullable: false })
  checkInDate?: string;
  @Column({ nullable: false })
  checkOutDate?: string;
  @Column("int")
  totalNights?: number;
  @Column("int")
  guestCount?: number;
  @Column("int")
  totalPrice?: number;
  @CreateDateColumn({ nullable: true })
  createdAt?: Date;
  @UpdateDateColumn({ nullable: true })
  updatedAt?: Date;
  @Column({
    nullable: true,
    type: "enum",
    enum: BookingStatus,
    default: BookingStatus.PENDING,
  })
  bookingStatus?: BookingStatus;
}
