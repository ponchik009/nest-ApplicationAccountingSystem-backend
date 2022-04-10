import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { UserModule } from './user/user.module';
import { Workgroup } from './workgroup/entities/workgroup.entity';
import { WorkgroupModule } from './workgroup/workgroup.module';
import { AuthModule } from './auth/auth.module';
import { ReasonsModule } from './reasons/reasons.module';
import { GlobalReason } from './reasons/entities/globalReason.entity';
import { RequestReason } from './reasons/entities/requestReason.entity';
import { Program } from './reasons/entities/program.entity';
import { Request } from './request/entities/request.entity';
import { RequestStage } from './request/entities/requestStage.entity';
import { RequestHistory } from './request/entities/requestHistory.entity';
import { RequestWork } from './request/entities/requestWorks.entity';
import { RequestModule } from './request/request.module';
import { MessageModule } from './message/message.module';
import { FileModule } from './file/file.module';
import { Message } from './message/message.entity';
import { File } from './file/file.entity';
import * as path from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { Role } from './workgroup/entities/role.entity';

require('dotenv').config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: +process.env.POSTGRES_PORT,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [
        User,
        Workgroup,
        Role,
        GlobalReason,
        RequestReason,
        Program,
        Request,
        RequestStage,
        RequestHistory,
        RequestWork,
        Message,
        File,
      ],
      synchronize: true,
      autoLoadEntities: true,
    }),
    UserModule,
    WorkgroupModule,
    AuthModule,
    ReasonsModule,
    RequestModule,
    MessageModule,
    FileModule,
    ServeStaticModule.forRoot({
      rootPath: path.resolve(__dirname, 'static'),
    }),
  ],
  providers: [],
  controllers: [],
})
export class AppModule {}
