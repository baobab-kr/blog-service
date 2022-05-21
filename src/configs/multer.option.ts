import { HttpException, HttpStatus } from '@nestjs/common';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage, memoryStorage } from 'multer';
import { extname } from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import { BadRequestException } from '@nestjs/common';
/*
  파일 생성 옵션
  multerMemoryOptions
*/
export const multerMemoryOptions = {

    fileFilter: (request, file, callback) => {
      if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
        
        callback(null, true);
      } else {
        callback(
          new HttpException(
            {
              message: 1,
              error: '지원하지 않는 이미지 형식입니다.',
            },
            HttpStatus.BAD_REQUEST,
          ),
          false,
        );
        
      }
    },

    stroage:diskStorage({
        destination: (request, file, callback) => {
          const uploadPath = 'uploads';
          if (!existsSync(uploadPath)) {
            // uploads 폴더가 존재하지 않을시, 생성합니다.
            mkdirSync(uploadPath);
          }
          callback(null, uploadPath);
        },
        filename: (request, file, callback) => {
          //파일 이름 설정
          callback(null, `${Date.now()}${extname(file.originalname)}`);
        },
      }),
    limits: {
        fieldNameSize: 3000, // 필드명 사이즈 최대값 (bytes)
        fieldSize: 3000 * 3000, // 필드 사이즈 값 설정 (MB)
        fileSize: 16777216, //multipart 형식 폼에서 최대 파일 사이즈(bytes)
       
    },
  };
  