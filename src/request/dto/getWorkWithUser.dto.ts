import { ApiProperty } from '@nestjs/swagger';

import { GetUserWithoutWorkgroup } from 'src/user/dto/getUserWithoutWorkgroup.dto';
import { Workgroup } from 'src/workgroup/entities/workgroup.entity';

export class GetWorkWithUser {
  @ApiProperty({ description: 'Уникальный идентификатор', example: 1 })
  public id: number;

  @ApiProperty({
    example: 'Tue, 15 Mar 2022 06:25:11 GMT',
    description:
      'Дата закрытия работы (можно использовать new Date(Date.now()).toUTCString())',
  })
  public dateOfEnd: Date;

  @ApiProperty({
    description: 'Специалист, выполняющий работу',
    type: () => GetUserWithoutWorkgroup,
  })
  public user: GetUserWithoutWorkgroup;

  @ApiProperty({
    description: 'Рабочая группа для данной работы',
    type: () => Workgroup,
  })
  public workgroup: Workgroup;
}
