import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  isNotEmpty,
  IsString,
  Length,
} from 'class-validator';

export class CreateWorkgroup {
  @ApiProperty({
    description: 'Название рабочей группы',
    example: '1С',
  })
  @IsString()
  @IsNotEmpty()
  public name: string;
}
