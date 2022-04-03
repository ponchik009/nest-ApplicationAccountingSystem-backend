import { Module } from '@nestjs/common';
import { RequestService } from './request.service';
import { RequestController } from './request.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Request } from './entities/request.entity';
import { RequestStage } from './entities/requestStage.entity';
import { RequestWork } from './entities/requestWorks.entity';
import { RequestHistory } from './entities/requestHistory.entity';
import { ReasonsModule } from 'src/reasons/reasons.module';

@Module({
  providers: [RequestService],
  controllers: [RequestController],
  imports: [
    TypeOrmModule.forFeature([
      Request,
      RequestStage,
      RequestWork,
      RequestHistory,
    ]),
    ReasonsModule,
  ],
})
export class RequestModule {}