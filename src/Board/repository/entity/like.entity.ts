import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Board } from './board.entity';
import { Users } from '../../../users/entity/user.entity';


@Entity()
export class Likes extends BaseEntity{
    @PrimaryGeneratedColumn()
    id : number;

    @Column()
    likes_status : number;

    @ManyToOne(type => Board, board => board.likes, {eager : false})
    @JoinColumn([{name : "board_id", referencedColumnName : "id"}])
    board_id : number;

    @ManyToOne(type => Users, users => users.likes, {eager : false})
    @JoinColumn([{name : "user_id", referencedColumnName : "id"}])
    user_id : number;

}