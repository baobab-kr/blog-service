import { Body, Controller, HttpCode, Patch, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ApplyJobService } from '../service/applyJob.service';
import { CreateApplyJobDTO } from '../dto/create-applyJob.dto';
import { UpdateApplyJobDTO } from '../dto/update-applyJob.dto';


@Controller("ApplyJob")
@ApiTags("Baobab_ApplyJob")
export class ApplyJobController{
    constructor(
        private applyJobService : ApplyJobService
    ){}

    
    @Post("/CreateRecruit")
    @HttpCode(200)
    async createRecruit(
        @Body() createApplyJobDTO : CreateApplyJobDTO
    ){
        await this.applyJobService.createApplyJob(createApplyJobDTO);
    }
    
    @Patch("/UpdateRecruit")
    @HttpCode(200)
    async updateRecruit(
        @Body("id") id : number,
        @Body() updateApplyJobDTO : UpdateApplyJobDTO
    ){
        await this.applyJobService.updateApplyJob(id, updateApplyJobDTO)
    }


    @Post("/GetRecruitAll")
    @HttpCode(200)
    async getRecruitAll(
        @Body("notice_id") id : number
    ){
        return await this.applyJobService.getRecruitAll(id);
    }

    @Post("/GetRecruit")
    @HttpCode(200)
    async getRecruit(
        @Body("id") id : number
    ){
        return await this.applyJobService.getRecruit(id);
    }

    @Patch("/DeleteRecruit")
    @HttpCode(200)
    async deleteRecruit(
        @Body("id") id : number
    ){
        await this.applyJobService.deleteRecruit(id)
    }


}