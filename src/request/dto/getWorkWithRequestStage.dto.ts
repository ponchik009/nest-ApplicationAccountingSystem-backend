import { ApiProperty } from '@nestjs/swagger';

import { Workgroup } from 'src/workgroup/entities/workgroup.entity';
import { GetRequestWithStage } from './getRequestWithStage.dto';

export class GetWorkWithRequestStage {
  @ApiProperty({ description: 'Уникальный идентификатор', example: 1 })
  public id: number;

  @ApiProperty({
    example: 'Tue, 15 Mar 2022 06:25:11 GMT',
    description:
      'Дата закрытия работы (можно использовать new Date(Date.now()).toUTCString())',
  })
  public dateOfEnd: Date;

  @ApiProperty({
    description: 'Заявка, по которой создана работа',
    type: () => GetRequestWithStage,
  })
  public request: GetRequestWithStage;

  @ApiProperty({
    description: 'Рабочая группа заявка',
    type: () => Workgroup,
  })
  public workgroup: Workgroup;
}
