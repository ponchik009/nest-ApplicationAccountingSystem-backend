import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GlobalReason } from './entities/globalReason.entity';
import { Program } from './entities/program.entity';
import { RequestReason } from './entities/requestReason.entity';
import { ReasonsController } from './reasons.controller';
import { ReasonsService } from './reasons.service';

@Module({
  controllers: [ReasonsController],
  providers: [ReasonsService],
  imports: [TypeOrmModule.forFeature([RequestReason, GlobalReason, Program])],
})
export class ReasonsModule {}
