import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { IsNotEmpty, IsDate } from "class-validator";

import { User } from "./User";

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty({message: 'El campo title es obligatorio'})
  title: string;

  @Column()
  @IsNotEmpty({message: 'El campo content es obligatorio'})
  content: string;

  @Column({unique: true})
  @IsNotEmpty()
  urlSlug: string;

  @Column({ type:"date"})
  @IsDate()
  creationDate: Date;

  @ManyToOne(() => User, (user) => user.post)
  user: User;
}
