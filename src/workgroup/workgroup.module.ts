import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Workgroup } from './entities/workgroup.entity';
import { WorkgroupService } from './workgroup.service';
import { WorkgroupController } from './workgroup.controller';
import { Role } from './entities/role.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';

@Module({
  providers: [WorkgroupService],
  imports: [
    TypeOrmModule.forFeature([Workgroup, Role]),
    AuthModule,
    forwardRef(() => UserModule),
  ],
  exports: [WorkgroupService],
  controllers: [WorkgroupController],
})
export class WorkgroupModule {}
