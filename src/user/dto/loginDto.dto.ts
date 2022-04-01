import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  isNotEmpty,
  IsString,
  Length,
} from 'class-validator';
import { Workgroup } from 'src/workgroup/workgroup.entity';

export class LoginDto {
  @ApiProperty({ description: 'Логин', example: 'ponchik009' })
  @IsNotEmpty()
  public login: string;

  @ApiProperty({ description: 'Хешированный пароль', example: 'qwerty123' })
  @IsNotEmpty()
  public password: string;
}
