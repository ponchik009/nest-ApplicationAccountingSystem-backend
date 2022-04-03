import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  isNotEmpty,
  IsString,
  Length,
} from 'class-validator';
import { User } from 'src/user/entities/user.entity';

export class AppointRequest {
  @ApiProperty({
    description: 'Пользователь из того же отдела, что и отправитель запроса',
  })
  @IsNotEmpty()
  public user: User;
}
