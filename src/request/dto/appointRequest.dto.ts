import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { GetUserWithoutWorkgroup } from 'src/user/dto/getUserWithoutWorkgroup.dto';

export class AppointRequest {
  @ApiProperty({
    description: 'Пользователь из того же отдела, что и отправитель запроса',
    type: () => GetUserWithoutWorkgroup,
  })
  @IsNotEmpty()
  public user: GetUserWithoutWorkgroup;
}
