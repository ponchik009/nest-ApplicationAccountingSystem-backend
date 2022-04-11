import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { Workgroup } from 'src/workgroup/entities/workgroup.entity';

export class UpdateUserDto {
  @ApiProperty({
    description: 'Уникальный идентификатор',
    example: 1,
    required: true,
  })
  public id: number;

  @ApiProperty({
    description: 'ФИО',
    example: 'Иванов Иван Иванович',
    required: false,
  })
  @IsOptional()
  @IsString()
  public name: string;

  @ApiProperty({
    description: 'Почта',
    example: 'user@mail.ru',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  public email: string;

  @ApiProperty({ description: 'Логин', example: 'ponchik009', required: false })
  @IsOptional()
  @IsString()
  @Length(6, 25)
  public login: string;

  @ApiProperty({
    description: 'Никнейм телеграма',
    example: 'luxorylife',
    required: false,
  })
  @IsOptional()
  @IsString()
  public telegram: string;

  @ApiProperty({
    description: 'Рабочая группа',
    required: true,
    example: {
      id: 2,
      name: '1С',
    },
    type: () => Workgroup,
  })
  @IsOptional()
  public workgroup: Workgroup;
}
