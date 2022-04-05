import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import * as uuid from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { File } from './file.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FileService {
  constructor(@InjectRepository(File) private fileRepo: Repository<File>) {}

  public async create(files): Promise<File[]> {
    const entities = [];

    for (const file of files.image) {
      const path = this.createFile(file);
      entities.push(
        this.fileRepo.create({
          path,
        }),
      );
    }

    return await this.fileRepo.save(entities);
  }

  private createFile(file): string {
    try {
      const fileExtension = file.originalname.split('.').pop();
      const fileName = uuid.v4() + '.' + fileExtension;
      const filePath = path.resolve(__dirname, '..', 'static', 'image');

      if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath, { recursive: true });
      }
      fs.writeFileSync(path.resolve(filePath, fileName), file.buffer);

      return 'image/' + fileName;
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
