import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { bookingEntity } from "./booking.entity";

@Entity("guest")
export class guestEntity {
  @PrimaryGeneratedColumn()
  id!: number;
  @Column()
  firstName?: string;
  @Column()
  lastName?: string;
  @Column({ unique: true })
  phone?: string;
  @Column({ unique: true })
  email?: string;
  @Column("int", { nullable: true, default: 0 })
  totalBooking?: number;
  @OneToMany(() => bookingEntity, (booking) => booking.id)
  bookings?: bookingEntity[];
}
