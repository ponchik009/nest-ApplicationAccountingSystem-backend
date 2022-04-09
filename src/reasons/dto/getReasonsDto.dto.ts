import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  isNotEmpty,
  IsString,
  Length,
} from 'class-validator';
import { GlobalReason } from '../entities/globalReason.entity';
import { Program } from '../entities/program.entity';
import { RequestReason } from '../entities/requestReason.entity';

export class GetReasons {
  @ApiProperty({
    description: 'Список глобальных причин',
    example: [
      {
        id: 1,
        name: 'Проблема с программой',
        requestReasons: [
          {
            id: 1,
            name: 'Требуется консультация',
            needsPrograms: true,
          },
        ],
      },
    ],
  })
  public globalReasons: GlobalReason[];

  @ApiProperty({
    description: 'Список программ',
    type: () => Program,
  })
  public programs: Program[];
}
