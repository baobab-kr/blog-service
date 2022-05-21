import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { registerAs } from "@nestjs/config";

export const typeOrmConfig : TypeOrmModuleOptions= {
    type: 'mysql',
    host: '127.0.0.1',
    port: 3306,
    username: 'root',
    password: '1234',
    database: 'baobab',
    entities: [__dirname+ '/../**/*.entity.{js,ts}'], // 사용할 entity의 클래스명을 넣어둔다.
    synchronize: true,
    autoLoadEntities : true
  }


  /*
  export const typeOrmConfig : TypeOrmModuleOptions= {
    type: 'mysql',
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_DATABASE,
    
    synchronize: Boolean(process.env.DATABASE_SYNCHRONIZE),
    autoLoadEntities : true
}

  
  */
 //entities: [__dirname+ '/../**/*.entity.{js,ts}'],