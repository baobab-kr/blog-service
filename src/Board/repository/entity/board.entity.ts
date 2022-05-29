
import { BaseEntity, Column, Entity, Generated, Index, JoinColumn, JoinTable, Like, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Tag } from './tag.entity';
import { Users } from '../../../users/entity/user.entity';
import { Likes } from './like.entity';
import { MaxLength, MinLength } from 'class-validator';


@Entity()
//@Index('id')
export class Board extends BaseEntity{
    @PrimaryGeneratedColumn()
    id : number;
    @Column()
    title : string;
    @Column()
    description : string;
    @Column("varchar",{length:4000})
    content : string;
    @Column()
    thumbnail : string;
    
    @ManyToOne(type => Users, user => user.boards, {eager : true})
    @JoinColumn([{name : "writer" , referencedColumnName : "id"}])
    //@Column()
    writer : number;
    @Column()
    views : number;
    @Column()
    date : Date;
    @Column()
    board_status : number;
    @Column()
    likes_count : number;

    @OneToMany(type => Tag, tag => tag.board_id,{
        eager: true,
        cascade: true,
        onDelete: 'CASCADE',
        onUpdate:'CASCADE'
      })
    tags : Tag[];

    @OneToMany(type => Likes, likes => likes.board_id)
    likes : Likes[];
}


