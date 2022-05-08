import { CacheModule, Module } from '@nestjs/common';
import { EmailService } from './email.service';

@Module({
    imports: [
        CacheModule.register({
          ttl: 600,
          max: 1000
      })],
    providers: [EmailService],
    exports: [EmailService],
})
export class EmailModule {}
