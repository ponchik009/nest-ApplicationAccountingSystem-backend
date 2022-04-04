import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { Workgroup } from 'src/workgroup/workgroup.entity';

export class RecruitRequest {
  @ApiProperty({
    description: 'Рабочая группа для донабора',
  })
  @IsNotEmpty()
  public workgroup: Workgroup;

  @ApiProperty({
    description: 'Количество работ для данной рабочей группы',
  })
  @IsNumber()
  public count: number;
}