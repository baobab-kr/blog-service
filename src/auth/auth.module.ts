import { CacheModule, Module } from '@nestjs/common';
import { AuthService } from './auth.service';

@Module({
  imports: [
    CacheModule.register({
      ttl: 600,
      max: 1000
  })],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
