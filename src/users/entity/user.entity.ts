import { Board } from "src/Board/repository/entity/board.entity"
import { Comment } from "src/Board/repository/entity/comment.entity"
import { Likes } from "src/Board/repository/entity/like.entity"
import { ReComment } from "src/Board/repository/entity/recomment.entity"
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"
import { ApplyJob } from '../../applyJob/entity/applyJob.entity';
import { Jobs } from '../../jobs/entity/jobs.entity';

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


    @OneToMany(()=>Board, board=> board.writer , {nullable:true})
    boards : Board[]
    @OneToMany(()=>Comment, comment=> comment.writer , {nullable:true})
    comments : Comment[]
    @OneToMany(()=>ReComment, reComment=> reComment.writer , {nullable:true})
    reComments : ReComment[]

    @OneToMany(()=>Likes, likes=> likes.user_id , {nullable:true})
    likes : Likes[]


    @OneToMany(()=>Jobs, jobs=> jobs.user_id , {nullable:false})
    jobs : Jobs[]

    @OneToMany(()=>ApplyJob, applyJob=> applyJob.user_id , {nullable:true})
    applyJobs : ApplyJob[]


}