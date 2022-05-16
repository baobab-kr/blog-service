import { Board } from "src/Board/repository/entity/board.entity"
import { Comment } from "src/Board/repository/entity/comment.entity"
import { ReComment } from "src/Board/repository/entity/recomment.entity"
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"

@Entity()
export class Users {
    @PrimaryGeneratedColumn()
    id: number

    @Column({length:15})
    userid: string

    @Column({length:9})
    username: string

    @Column()
    email: string

    @Column({length:100})
    password: string

    @Column({nullable:true})
    role: number

    @Column({
        length:200,
        nullable:true,
    })
    description: string

    @Column({nullable:true})
    avatar_image: string

    @Column({nullable:true})
    currentRefreshToken: string


    @OneToMany(()=>Board, board=> board.id , {nullable:true})
    boards : Board[]
    @OneToMany(()=>Comment, comment=> comment.id , {nullable:true})
    comments : Board[]
    @OneToMany(()=>ReComment, reComment=> reComment.id , {nullable:true})
    reComments : Board[]



}