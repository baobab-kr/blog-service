import { EntityRepository, Repository } from "typeorm";
import { ApplyJob } from '../entity/applyJob.entity';
import { CreateJobsDTO } from '../../jobs/dto/create-jobs.dto';

@EntityRepository(ApplyJob)
export class ApplyJobRepository extends Repository<ApplyJob>{

    async createRecruit(CreateJobsDTO : CreateJobsDTO){

        const recruit = await this.create({
            
        })

        await this.save(recruit);
    }
    


}
