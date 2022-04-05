import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  isNotEmpty,
  IsObject,
  IsString,
  Length,
} from 'class-validator';
import { RequestReason } from 'src/reasons/entities/requestReason.entity';

export class CreateRequest {
  @ApiProperty({
    description: 'Описание проблемы',
    example:
      'Здравствуйте, возникла проблема <Проблема 1>, требуется консультация со специалистом.',
  })
  @IsString()
  @IsNotEmpty()
  public description: string;

  @ApiProperty({
    description: 'Причина заявки',
  })
  @IsNotEmpty()
  public reason: string;
}
