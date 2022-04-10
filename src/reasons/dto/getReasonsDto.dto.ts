import { ApiProperty } from '@nestjs/swagger';

import { GlobalReason } from '../entities/globalReason.entity';
import { Program } from '../entities/program.entity';

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
