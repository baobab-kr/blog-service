import { ApiQuery } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { string } from 'joi';
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { Jobs } from '../../jobs/entity/jobs.entity';
import { Users } from '../../users/entity/user.entity';

@Entity()
export class ApplyJob extends BaseEntity{

    //채용 공고 id
    @PrimaryGeneratedColumn()
    id : number
    
    //공지 id
    @Column({nullable : false})
    @ManyToOne(type => Jobs, jobs => jobs.applyJobs, {eager : false})
    @JoinColumn([{name : "jobs_Id" , referencedColumnName : "id"}])
    jobs_Id : number

    //User id
    @Column({nullable : false})
    @ManyToOne(type => Users, user => user.applyJobs, {eager : false})
    @JoinColumn([{name : "user_id" , referencedColumnName : "id"}])
    user_id : number
 

    @Column({
        type : "longtext",
        nullable : false
    })
    title : string

    @Column({
        type : "varchar",
        //length : 20,
        nullable : false
    })
    name : string
    
    @Column({
        type : "varchar",
        //length : 50,
        nullable : false
    })
    email : string

    @Column({
        type : "varchar",
        //length : 100,
        nullable : true
    })
    techStack : string

    @Column({
        type : "int",
        //length : 5,
        nullable : true
    })
    careerYear : number

    @Column({
        type : "longtext",
        nullable : false
    })
    resumeUrl : string

    @Column({
        type : "longtext",
        nullable : true
    })
    socialUrl : string

    @Column({
        type : "varchar",
        //length : 250,
        nullable : false
    })
    profile : string

    @Column({
        type : "int",
        //length : 5,
        nullable : false
    })
    education : number

    @Column({
        type : "int",
        //length : 5,
        nullable : false
    })
    educationStatus : number
 

}