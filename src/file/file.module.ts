import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { File } from './file.entity';
import { FileService } from './file.service';

@Module({
  providers: [FileService],
  exports: [FileService],
  imports: [TypeOrmModule.forFeature([File])],
})
export class FileModule {}
