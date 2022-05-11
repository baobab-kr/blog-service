import { CacheModule, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from 'src/users/users.module';
  
@Module({
  imports: [
    CacheModule.register({
      ttl: 600,
      max: 1000
    }),
    JwtModule.register({}),
    PassportModule,
  ],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
