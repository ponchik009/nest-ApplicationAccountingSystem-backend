import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { UserModule } from './user/user.module';
import { Workgroup } from './workgroup/workgroup.entity';
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
        GlobalReason,
        RequestReason,
        Program,
        Request,
        RequestStage,
        RequestHistory,
        RequestWork,
      ],
      synchronize: true,
      autoLoadEntities: true,
    }),
    UserModule,
    WorkgroupModule,
    AuthModule,
    ReasonsModule,
    RequestModule,
  ],
  providers: [],
  controllers: [],
})
export class AppModule {}
