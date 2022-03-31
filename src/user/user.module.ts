import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkgroupModule } from 'src/workgroup/workgroup.module';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@Module({
  providers: [UserService],
  imports: [TypeOrmModule.forFeature([User]), WorkgroupModule],
  exports: [UserService],
})
export class UserModule {}
