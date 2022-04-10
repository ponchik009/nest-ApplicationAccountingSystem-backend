import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { Workgroup } from 'src/workgroup/entities/workgroup.entity';
import { GlobalReason } from '../entities/globalReason.entity';

export class CreateRequestReason {
  @ApiProperty({
    description: 'Название',
    example: 'Требуется консультация по работе с программой',
  })
  @IsString()
  @IsNotEmpty()
  public name: string;

  @ApiProperty({
    description: 'Добавляется ли в заявку по этой причине название программы',
    example: true,
  })
  public needsPrograms: boolean;

  @ApiProperty({
    description: 'Стандартная рабочая группа, назначаемая по этой проблеме',
    example: {
      id: 1,
      name: 'Системное администрирование',
    },
  })
  @IsNotEmpty()
  public defaultWorkgroup: Workgroup;

  @ApiProperty({
    description: 'Список глобальных причин, к которым можно отнести данную',
    example: [
      {
        id: 1,
        name: 'Проблема с работой программы',
      },
    ],
  })
  @IsArray()
  @IsNotEmpty()
  public globalReasons: GlobalReason[];
}
