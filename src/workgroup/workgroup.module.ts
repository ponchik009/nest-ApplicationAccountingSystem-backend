import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Workgroup } from './workgroup.entity';
import { WorkgroupService } from './workgroup.service';

@Module({
  providers: [WorkgroupService],
  imports: [TypeOrmModule.forFeature([Workgroup])],
})
export class WorkgroupModule {}
