import { type } from 'os';
import { ApplyJob } from 'src/applyJob/entity/applyJob.entity';
import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Users } from '../../users/entity/user.entity';


@Entity()
export class Jobs extends BaseEntity{

    
    //채용 공고 id
    @PrimaryGeneratedColumn()
    id : number;

    
    @ManyToOne(type=>Users, users=> users.jobs, {
        nullable : false
    })
    user_id : number 

    @Column({
        nullable:false,
        type:'varchar',
        //length:30
    })
    companyName : string

    @Column({
        nullable:false,
        type:'varchar',
        //length:20
    })
    managerName:string

    @Column({
        nullable:false,
        type:'varchar',
        //length:50
    })
    managerContact:string

    @Column({
        nullable:false,
        type:'varchar'
    })
    license : string


    @Column({
        nullable:false,
        type:'varchar',
        //length:20
    })
    field : string

    @Column({
        nullable:false,
        type:'varchar',
        //length:30
    })
    title : string

    @Column({
        nullable:false,
        type:'varchar'
    })
    logo : string

    @Column({
        nullable:false,
        type:'varchar',
        //length:100
    })
    location : string

    @Column({
        nullable:false,
        type:'varchar',
        //length:100
    })
    message : string

    @Column({
        nullable:false,
        type:'varchar',
        //length:260
    })
    talent : string

    @Column({
        nullable:false,
        type:'int',
        //length:5
    })
    careerType : number

    @Column({
        nullable:false,
        type:'longtext'
    })
    url : string

    @Column({
        nullable:false,
        type:'varchar',
        //length : 20
    })
    salary : string

    @Column({
        nullable:true,
        type:'varchar',
        //length : 8
    })
    startDate : string

    
    @Column({
        nullable:true,
        type:'varchar',
        //length : 8
    })
    endDate : string

    @Column({
        nullable:false,
        type:'int',
        //length : 5
    })
    approvalStatus : number
    
    @Column({
        nullable:false,
        type:'int',
        //length : 5
    })    
    jobStatus : number 


    @OneToMany(type => ApplyJob, applyJob => applyJob.jobs_Id, {
        eager: true,
        cascade: true,
        onDelete: 'CASCADE',
        onUpdate:'CASCADE'
    })
    applyJobs : ApplyJob[]
        
}