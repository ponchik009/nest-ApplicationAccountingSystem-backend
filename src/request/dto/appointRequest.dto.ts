import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  isNotEmpty,
  IsString,
  Length,
} from 'class-validator';
import { GetUserWithoutWorkgroup } from 'src/user/dto/getUserWithoutWorkgroup.dto';
import { User } from 'src/user/entities/user.entity';

export class AppointRequest {
  @ApiProperty({
    description: 'Пользователь из того же отдела, что и отправитель запроса',
    type: () => GetUserWithoutWorkgroup,
  })
  @IsNotEmpty()
  public user: GetUserWithoutWorkgroup;
}
