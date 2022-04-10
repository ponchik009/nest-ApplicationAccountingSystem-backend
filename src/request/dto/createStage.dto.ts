import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateStage {
  @ApiProperty({
    description: 'Название стадии',
    example: 'В ожидании',
  })
  @IsString()
  @IsNotEmpty()
  public name: string;
}
