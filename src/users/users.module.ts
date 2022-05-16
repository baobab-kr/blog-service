import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { JwtAccessStrategy } from 'src/auth/security/passport.jwt-access.strategy';
import { JwtRefreshStrategy } from 'src/auth/security/passport.jwt-refresh.strategy';
import { EmailModule } from 'src/email/email.module';
import { Users } from './entity/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { BoardModule } from '../Board/board.module';
import { Board } from '../Board/repository/entity/board.entity';
import { ReComment } from 'src/Board/repository/entity/recomment.entity';
import { Comment } from 'src/Board/repository/entity/comment.entity';

@Module({
    imports: [
        EmailModule,
        TypeOrmModule.forFeature([Users,Board,Comment,ReComment]),
        AuthModule,
        BoardModule
    ],
    controllers: [UsersController],
    providers: [UsersService, JwtAccessStrategy, JwtRefreshStrategy],
})
export class UsersModule {}
