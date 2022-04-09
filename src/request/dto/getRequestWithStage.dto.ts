import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  isNotEmpty,
  IsString,
  Length,
} from 'class-validator';
import { RequestStage } from '../entities/requestStage.entity';

export class GetRequestWithStage {
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
}
