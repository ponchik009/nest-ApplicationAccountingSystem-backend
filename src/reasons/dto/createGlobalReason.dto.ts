import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  isNotEmpty,
  IsString,
  Length,
} from 'class-validator';
import { RequestReason } from '../entities/requestReason.entity';

export class CreateGlobalReasonDto {
  @ApiProperty({
    description: 'Название',
    example: 'Проблема с работой программы',
  })
  @IsString()
  @IsNotEmpty()
  public name: string;

  @ApiProperty({
    description: 'Список причин, которые можно сгруппировать под этой',
    example: [
      {
        id: 1,
        name: 'Требуется консультация',
      },
    ],
  })
  public requestReqsons: RequestReason[];
}
