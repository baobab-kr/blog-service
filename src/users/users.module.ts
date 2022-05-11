import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { JwtAccessStrategy } from 'src/auth/security/passport.jwt-access.strategy';
import { EmailModule } from 'src/email/email.module';
import { Users } from './entity/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
    imports: [
        EmailModule,
        TypeOrmModule.forFeature([Users]),
        AuthModule,
    ],
    controllers: [UsersController],
    providers: [UsersService, JwtAccessStrategy],
})
export class UsersModule {}
