import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { Workgroup } from 'src/workgroup/entities/workgroup.entity';

export class RecruitRequest {
  @ApiProperty({
    description: 'Рабочая группа для донабора',
    type: () => Workgroup,
  })
  @IsNotEmpty()
  public workgroup: Workgroup;

  @ApiProperty({
    description: 'Количество работ для данной рабочей группы',
    type: 'number',
  })
  @IsNumber()
  public count: number;
}
