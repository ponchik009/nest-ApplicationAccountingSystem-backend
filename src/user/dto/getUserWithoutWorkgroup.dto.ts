import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  isNotEmpty,
  IsString,
  Length,
} from 'class-validator';
import { Workgroup } from 'src/workgroup/workgroup.entity';

export class GetUserWithoutWorkgroup {
  @ApiProperty({
    description: 'Уникальный идентификатор',
    example: 1,
  })
  public id: number;

  @ApiProperty({ description: 'ФИО', example: 'Иванов Иван Иванович' })
  @IsString()
  @IsNotEmpty()
  public name: string;

  @ApiProperty({ description: 'Логин', example: 'ponchik009' })
  @IsString()
  @Length(6, 25)
  @IsNotEmpty()
  public login: string;

  @ApiProperty({
    description: 'Никнейм телеграма',
    example: 'luxorylife',
  })
  public telegram: string;
}
