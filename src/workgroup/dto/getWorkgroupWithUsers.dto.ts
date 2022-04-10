import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { GetUserWithoutWorkgroup } from 'src/user/dto/getUserWithoutWorkgroup.dto';

export class GetWorkgroupWithUsers {
  @ApiProperty({
    description: 'Уникальный идентификатор',
    example: 2,
  })
  public id: number;

  @ApiProperty({
    description: 'Название рабочей группы',
    example: '1С',
  })
  @IsString()
  @IsNotEmpty()
  public name: string;

  @ApiProperty({
    description: 'Пользователи рабочей группы',
    type: () => [GetUserWithoutWorkgroup],
  })
  public users: GetUserWithoutWorkgroup[];
}
