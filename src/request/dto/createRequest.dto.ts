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
    description: 'Причина заявки (JSON строка)',
    example: '{"id":1}',
  })
  @IsNotEmpty()
  public reason: string;
}
