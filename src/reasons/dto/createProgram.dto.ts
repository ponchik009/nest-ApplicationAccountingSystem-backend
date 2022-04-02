import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  isNotEmpty,
  IsString,
  Length,
} from 'class-validator';
import { GlobalReason } from '../entities/globalReason.entity';

export class CreateProgram {
  @ApiProperty({
    description: 'Название программы',
    example: '1С: Управление персоналом',
  })
  @IsString()
  @IsNotEmpty()
  public name: string;
}
