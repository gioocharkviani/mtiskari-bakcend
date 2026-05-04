import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("confirmation")
export class confirmationEntity {
  @PrimaryGeneratedColumn()
  id!: number;
  @Column()
  token?: string;
}
