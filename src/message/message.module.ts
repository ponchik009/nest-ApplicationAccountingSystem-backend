import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileModule } from 'src/file/file.module';
import { Message } from './message.entity';
import { MessageService } from './message.service';

@Module({
  providers: [MessageService],
  exports: [MessageService],
  imports: [TypeOrmModule.forFeature([Message]), FileModule],
})
export class MessageModule {}
