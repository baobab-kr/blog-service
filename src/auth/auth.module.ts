import { CacheModule, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
  
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
    PassportModule,
  ],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
