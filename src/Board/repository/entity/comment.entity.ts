
import { Users } from 'src/users/entity/user.entity';
import { BaseEntity, Column, Entity, Generated, Index, JoinColumn, JoinTable, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ReComment } from './recomment.entity';


@Entity()
export class Comment extends BaseEntity{
    @PrimaryGeneratedColumn()
    id : number;

    @ManyToOne(type => Users, user => user.comments, {eager : true})
    @JoinColumn([{name : "writer" , referencedColumnName : "id"}])
    //@Column()
    writer : number;
    
    @Column("varchar",{length:4000})
    content : string;
    @Column()
    board_id : number;
    @Column()
    date : Date;
    @Column()
    comment_status : number;

    @OneToMany(type => ReComment, reComment => reComment.comment_id, {eager: true, onDelete : 'CASCADE'})
    reComments : ReComment[];
}