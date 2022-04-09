import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  isNotEmpty,
  IsString,
  Length,
} from 'class-validator';
import { RequestReason } from '../entities/requestReason.entity';

export class GetGlobalReasonWithoutSubreasons {
  @ApiProperty({
    description: 'Уникальный идентификатор',
    example: 1,
  })
  @IsNotEmpty()
  public id: number;

  @ApiProperty({
    description: 'Название',
    example: 'Проблема с работой программы',
  })
  @IsString()
  @IsNotEmpty()
  public name: string;
}
