import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("token")
export class tokenEntity {
  @PrimaryGeneratedColumn()
  id!: number;
  @Column()
  token!: string;
  @Column()
  isActive!: boolean;
  @Column({ nullable: false })
  type!: "ADMIN" | "CUSTOMER" | "MODERATOR";
  @CreateDateColumn()
  createdAt?: Date;
  @Column({ type: "timestamp" })
  expiresAt!: Date;
}
