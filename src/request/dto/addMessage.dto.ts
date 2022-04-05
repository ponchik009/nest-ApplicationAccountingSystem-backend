import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { User } from 'src/user/entities/user.entity';

export class AddMessage {
  @ApiProperty({
    description: 'Текст сообщения',
    example:
      'В школе меня бросила девушка потому что сказала что я не настоящий дед инсайд если я попаду в психокидс то она поймёт что я настоящий гуль тру канеки ссс +баран бананаранга',
  })
  public text: string;
}
