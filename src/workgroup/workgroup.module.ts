import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Workgroup } from './entities/workgroup.entity';
import { WorkgroupService } from './workgroup.service';
import { WorkgroupController } from './workgroup.controller';
import { Role } from './entities/role.entity';

@Module({
  providers: [WorkgroupService],
  imports: [TypeOrmModule.forFeature([Workgroup, Role])],
  exports: [WorkgroupService],
  controllers: [WorkgroupController],
})
export class WorkgroupModule {}
