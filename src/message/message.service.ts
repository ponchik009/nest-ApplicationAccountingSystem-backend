import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FileService } from 'src/file/file.service';
import { Repository } from 'typeorm';
import { CreateMessage } from './dto/createMessage.dto';
import { Message } from './message.entity';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message) private messageRepo: Repository<Message>,
    private fileServise: FileService,
  ) {}

  public async create(dto: CreateMessage, files) {
    const filesToSave = await this.fileServise.create(files);

    const message = this.messageRepo.create(dto);
    message.files = filesToSave;

    return await this.messageRepo.save(message);
  }
}
