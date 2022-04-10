import { ApiProperty } from '@nestjs/swagger';

import { Message } from 'src/message/message.entity';
import { GetUserWithoutWorkgroup } from 'src/user/dto/getUserWithoutWorkgroup.dto';
import { RequestStage } from '../entities/requestStage.entity';
import { GetWorkWithUser } from './getWorkWithUser.dto';

export class GetRequestWithWorks {
  @ApiProperty({ description: 'Уникальный идентификатор', example: 1 })
  public id: number;

  @ApiProperty({
    description: 'Сформированное название заявки',
    example:
      'Требуется консультация по работе с программой 1С:Управление персоналом',
  })
  public specific_name: string;

  @ApiProperty({
    example: 'Tue, 15 Mar 2022 06:25:11 GMT',
    description:
      'Дата создания заявки (можно использовать new Date(Date.now()).toUTCString())',
  })
  public date: Date;

  @ApiProperty({
    description: 'Стадия заявки',
    type: () => RequestStage,
  })
  public stage: RequestStage;

  @ApiProperty({
    description: 'Создатель заявки',
    type: () => GetUserWithoutWorkgroup,
  })
  public user: GetUserWithoutWorkgroup;

  @ApiProperty({
    description: 'Собщения заявки',
    type: () => [Message],
  })
  public messages: Message[];

  @ApiProperty({
    description: 'Работы по заявке',
    type: () => [GetWorkWithUser],
  })
  public works: GetWorkWithUser[];
}
