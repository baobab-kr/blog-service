
import { Users } from 'src/users/entity/user.entity';
import { BaseEntity, Column, Entity, Generated, Index, JoinColumn, JoinTable, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Comment } from './comment.entity';

@Entity()
export class ReComment extends BaseEntity{
    @PrimaryGeneratedColumn()
    id : number;

    @ManyToOne(type => Users, user => user.reComments, {eager : true})
    @JoinColumn([{name : "writer" , referencedColumnName : "id"}])
    //@Column()
    writer :number;

    @Column("varchar",{length:4000})
    content : string;

    @ManyToOne(type => Comment, comment => comment.reComments)
    @JoinColumn([{ name: 'comment_id', referencedColumnName: 'id' }])
    //@Column()
    comment_id : number;

    @Column()
    date : Date;
    @Column()
    recomment_status : number;
    
}