import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

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
    token: string

    @Column({nullable:true})
    expire_time: number
}