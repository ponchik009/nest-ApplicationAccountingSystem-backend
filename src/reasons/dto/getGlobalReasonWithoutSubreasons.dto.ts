import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetGlobalReasonWithoutSubreasons {
  @ApiProperty({
    description: 'Уникальный идентификатор',
    example: 1,
  })
  @IsNotEmpty()
  public id: number;

  @ApiProperty({
    description: 'Название',
    example: 'Проблема с работой программы',
  })
  @IsString()
  @IsNotEmpty()
  public name: string;
}
