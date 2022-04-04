import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Workgroup } from './workgroup.entity';
import { WorkgroupService } from './workgroup.service';
import { WorkgroupController } from './workgroup.controller';

@Module({
  providers: [WorkgroupService],
  imports: [TypeOrmModule.forFeature([Workgroup])],
  exports: [WorkgroupService],
  controllers: [WorkgroupController],
})
export class WorkgroupModule {}
