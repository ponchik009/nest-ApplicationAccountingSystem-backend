import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  isNotEmpty,
  IsString,
  Length,
} from 'class-validator';

export class CreateStage {
  @ApiProperty({
    description: 'Название стадии',
    example: 'В ожидании',
  })
  @IsString()
  @IsNotEmpty()
  public name: string;
}
