import { ApiProperty } from '@nestjs/swagger';

export class AddMessage {
  @ApiProperty({
    description: 'Текст сообщения',
    example:
      'В школе меня бросила девушка потому что сказала что я не настоящий дед инсайд если я попаду в психокидс то она поймёт что я настоящий гуль тру канеки ссс +баран бананаранга',
  })
  public text: string;
}
