import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class PasswordRecoveryDto {
  @ApiProperty({ description: 'Почта', example: 'vetilay@mail.ru' })
  @IsNotEmpty()
  @IsEmail()
  public email: string;
}
