import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: 'ФИО', example: 'Иванов Иван Иванович' })
  @IsString()
  public name: string;

  @ApiProperty({ description: 'Почта', example: 'user@mail.ru' })
  @IsEmail()
  public email: string;

  @ApiProperty({ description: 'Логин', example: 'ponchik009' })
  @IsString()
  @Length(6, 25)
  public login: string;

  @ApiProperty({ description: 'Хешированный пароль', example: 'qwerty123' })
  @IsString()
  @Length(6, 25)
  public password: string;

  @ApiProperty({
    description: 'Никнейм телеграма',
    example: 'luxorylife',
    required: false,
  })
  @IsString()
  public telegram: string;
}
