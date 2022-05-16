import { Module } from '@nestjs/common';

import { BoardController } from './controller/board.controller';
import { BoardService  } from './service/board.service';
import { BoardRepository} from './repository/board.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentRepository } from './repository/comment.repository';
import { ReCommentRepository } from './repository/recomment.repository';
import { CommentService } from './service/commnet.service';
import { ReCommentService } from './service/recomment.service';
import { TagRepository } from './repository/tag.repository';

@Module({
  imports : [TypeOrmModule.forFeature([BoardRepository,CommentRepository,ReCommentRepository,TagRepository])
],
  controllers: [BoardController],
  providers: [BoardService, CommentService, ReCommentService]
})
export class BoardModule {}
