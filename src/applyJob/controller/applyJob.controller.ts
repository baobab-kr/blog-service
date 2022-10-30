import { Body, Controller, Get, HttpCode, Patch, Post, Query, Req, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags } from "@nestjs/swagger";
import { ApplyJobService } from '../service/applyJob.service';
import { CreateApplyJobDTO } from '../dto/create-applyJob.dto';
import { UpdateApplyJobDTO } from '../dto/update-applyJob.dto';
import { Request } from "express";


@Controller("ApplyJob")
@ApiTags("Baobab_ApplyJob")
export class ApplyJobController{
    constructor(
        private applyJobService : ApplyJobService
    ){}

    
    @Post("/CreateApplyJob")
    @HttpCode(200)
    async CreateApplyJob(
        @Req() req: Request,
        @Body() createApplyJobDTO : CreateApplyJobDTO
    ){

        
        await this.applyJobService.createApplyJob(createApplyJobDTO);
        
    }
    
    @Patch("/UpdateApplyJob")
    @HttpCode(200)
    async UpdateApplyJob(
        @Body("id") id : number,
        @Body() updateApplyJobDTO : UpdateApplyJobDTO
    ){
        await this.applyJobService.updateApplyJob(id, updateApplyJobDTO)
    }


    @Get("/GetApplyJobAll")
    @HttpCode(200)
    async GetApplyJobAll(
        @Query("jobs_id") jobs_id : number
    ){
        return await this.applyJobService.getApplyJobsAll(jobs_id);
    }

    @Get("/GetApplyJob")
    @HttpCode(200)
    async GetApplyJob(
        @Query("id") id : number
    ){
        console.log(await this.applyJobService.getApplyJobs(id))
        return await this.applyJobService.getApplyJobs(id);
    }

    @Get("/GetApplyJobsAll_inUser")
    @HttpCode(200)
    async GetApplyJobsAll_inUser(
        @Query("user_id") user_id : number
    ){
        return await this.applyJobService.getApplyJobsAll_inUser(user_id);
    }

    @Patch("/DeleteApplyJob")
    @HttpCode(200)
    async DeleteApplyJob(
        @Body("id") id : number
    ){
        await this.applyJobService.deleteRecruit(id)
    }


}