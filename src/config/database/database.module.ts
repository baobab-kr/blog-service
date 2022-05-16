import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Board } from "src/Board/repository/entity/board.entity";
import { Comment } from "src/Board/repository/entity/comment.entity";
import { ReComment } from "src/Board/repository/entity/recomment.entity";
import { Tag } from "src/Board/repository/entity/tag.entity";
import { Users } from "src/users/entity/user.entity";

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                type: 'mysql',
                host: configService.get('DB_HOST'),
                port: +configService.get('DB_PORT'),
                username: configService.get('DB_USERNAME'),
                password: configService.get('DB_PASSWORD'),
                database: configService.get('DB_NAME'),
                entities: [
                    Users,Board,Comment,ReComment,Tag
                ],
                synchronize: Boolean(process.env.DB_SYNC),
            }),
        }),
    ],
})

export class DatabaseModule {}