import { CacheModule, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    CacheModule.register({
      ttl: 600,
      max: 1000
    }),
    JwtModule.register({
      secret: 'SECRET',
      signOptions: { 
        expiresIn: '300s'
       },
    }),
  ],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
