import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class VerifyCodeDto {
  @ApiProperty({ description: 'Код с почты', example: '123456' })
  @IsNotEmpty()
  public code: string;

  @ApiProperty({ description: 'Почта', example: 'vetilay@mail.ru' })
  @IsNotEmpty()
  @IsEmail()
  public email: string;
}
