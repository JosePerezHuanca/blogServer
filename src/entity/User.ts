import { Entity, PrimaryGeneratedColumn, Column, OneToMany} from "typeorm"
import { IsNotEmpty } from "class-validator"
import { Post } from "./Post"

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number

    @Column({unique: true})
    @IsNotEmpty()
    userName: string

    @Column()
    @IsNotEmpty()
    password: string

    @Column({type: 'boolean', default: false})
    isAdmin: boolean;

    @OneToMany(()=>Post ,(post)=>post.user)
    post: Post;
}

