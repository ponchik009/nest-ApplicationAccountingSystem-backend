import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  isNotEmpty,
  IsString,
  Length,
} from 'class-validator';
import { Workgroup } from 'src/workgroup/entities/workgroup.entity';

export class CreateUserDto {
  @ApiProperty({ description: 'ФИО', example: 'Иванов Иван Иванович' })
  @IsString()
  @IsNotEmpty()
  public name: string;

  @ApiProperty({ description: 'Почта', example: 'user@mail.ru' })
  @IsEmail()
  @IsNotEmpty()
  public email: string;

  @ApiProperty({ description: 'Логин', example: 'ponchik009' })
  @IsString()
  @Length(6, 25)
  @IsNotEmpty()
  public login: string;

  @ApiProperty({ description: 'Хешированный пароль', example: 'qwerty123' })
  @IsString()
  @Length(6, 25)
  @IsNotEmpty()
  public password: string;

  @ApiProperty({
    description: 'Никнейм телеграма',
    example: 'luxorylife',
    required: false,
  })
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
  @IsNotEmpty()
  public workgroup: Workgroup;
}
