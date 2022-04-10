import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Role } from '../entities/role.entity';

export class CreateWorkgroup {
  @ApiProperty({
    description: 'Название рабочей группы',
    example: '1С',
  })
  @IsString()
  @IsNotEmpty()
  public name: string;

  @ApiProperty({
    description: 'Роль рабочей группы',
    type: () => Role,
  })
  public role: Role;
}
