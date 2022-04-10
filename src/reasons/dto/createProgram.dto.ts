import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateProgram {
  @ApiProperty({
    description: 'Название программы',
    example: '1С: Управление персоналом',
  })
  @IsString()
  @IsNotEmpty()
  public name: string;
}
