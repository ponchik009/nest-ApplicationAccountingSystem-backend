import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  isNotEmpty,
  IsString,
  Length,
} from 'class-validator';
import { User } from 'src/user/entities/user.entity';
import { Workgroup } from 'src/workgroup/workgroup.entity';
import { RequestWork } from '../entities/requestWorks.entity';

export class RedirectRequest {
  @ApiProperty({
    description: 'Работа по заявке, которую перенаправляем',
  })
  @IsNotEmpty()
  public work: RequestWork;

  @ApiProperty({
    description: 'Новая рабочая группа для работы',
  })
  @IsNotEmpty()
  public workgroup: Workgroup;
}
