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

    // Github 서비스와 동일하게 최대 255글자로 변경하였음.
    @Column({length:255})
    username: string

    // Github 사용자들의 경우, PRIVATE 정책으로 사용했을 때 Null 값이 저장될 수 있음.
    // 때문에, Github OAuth 설정 추가하면서 Nullable 설정도 활성화하였음.
    @Column({nullable:true})
    email: string
    
    // Github 사용자들의 경우, PRIVATE 정책으로 사용했을 때 Null 값이 저장될 수 있음.
    // 때문에, Github OAuth 설정 추가하면서 Nullable 설정도 활성화하였음.
    @Column({
        length:100, 
        nullable: true
    })
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

    @Column({nullable:true})
    techStack: string

    @Column({nullable:true})
    socialUrl: string

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