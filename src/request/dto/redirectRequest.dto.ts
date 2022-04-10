import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

import { Workgroup } from 'src/workgroup/entities/workgroup.entity';
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
