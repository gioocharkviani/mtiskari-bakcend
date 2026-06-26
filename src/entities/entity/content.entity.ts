import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("content")
export class ContentEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  key!: string;

  @Column({ type: "text", nullable: true })
  en?: string;

  @Column({ type: "text", nullable: true })
  ka?: string;

  @UpdateDateColumn({ nullable: true })
  updatedAt?: Date;
}
