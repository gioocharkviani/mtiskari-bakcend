import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("email")
export class emailEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  from: string;
  @Column()
  subject: string;
  @Column()
  content: string;
}
