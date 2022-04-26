import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRequest {
  @ApiProperty({
    description: 'Описание проблемы',
    example:
      'Здравствуйте, возникла проблема <Проблема 1>, требуется консультация со специалистом.',
  })
  @IsString()
  @IsNotEmpty()
  public description: string;

  @ApiProperty({
    description: 'Причина заявки (id)',
    example: 1,
  })
  @IsNotEmpty()
  public reason: number;
}
