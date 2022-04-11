import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkgroupModule } from 'src/workgroup/workgroup.module';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { EmailService } from 'src/email/email.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  providers: [UserService, EmailService],
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => WorkgroupModule),
    forwardRef(() => AuthModule),
  ],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
