import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { UserModule } from './user/user.module';
import { Workgroup } from './workgroup/workgroup.entity';
import { WorkgroupModule } from './workgroup/workgroup.module';
import { AuthModule } from './auth/auth.module';

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
      entities: [User, Workgroup],
      synchronize: true,
      autoLoadEntities: true,
    }),
    UserModule,
    WorkgroupModule,
    AuthModule,
  ],
  providers: [],
  controllers: [],
})
export class AppModule {}
