import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export class CreateUserDto {
  @ApiProperty({ description: 'ФИО', example: 'Иванов Иван Иванович' })
  public name: string;

  @ApiProperty({ description: 'Почта', example: 'user@mail.ru' })
  public email: string;

  @ApiProperty({ description: 'Логин', example: 'ponchik009' })
  public login: string;

  @ApiProperty({ description: 'Хешированный пароль', example: 'qwerty123' })
  public password: string;

  @ApiProperty({
    description: 'Никнейм телеграма',
    example: 'luxorylife',
    required: false,
  })
  public telegram: string;
}
