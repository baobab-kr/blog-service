import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Param } from '@nestjs/common';
import { Board } from './board.entity';


@Entity()
export class Tag extends BaseEntity{
    @PrimaryGeneratedColumn()
    id : number;

    @Column()
    tag_name : string;

    @ManyToOne(type => Board, board => board.tags)
    @JoinColumn([{name : "board_id", referencedColumnName : "id"}])
    board_id : number;

}