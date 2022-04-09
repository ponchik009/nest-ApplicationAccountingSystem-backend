import { ApiProperty } from '@nestjs/swagger';
import { File } from 'src/file/file.entity';
import { Request } from 'src/request/entities/request.entity';
import { GetUserDto } from 'src/user/dto/getUserDto.dto';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Message {
  @ApiProperty({
    description: 'Уникальный идентификатор',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  public id: number;

  @ApiProperty({
    description: 'Текст сообщения',
    example:
      'В школе меня бросила девушка потому что сказала что я не настоящий дед инсайд если я попаду в психокидс то она поймёт что я настоящий гуль тру канеки ссс +баран бананаранга',
  })
  @Column()
  public text: string;

  @ApiProperty({
    description: 'Автор сообщения',
    type: () => GetUserDto,
  })
  @ManyToOne(() => User)
  public user: User;

  @ManyToOne(() => Request)
  public request: Request;

  @ApiProperty({
    description: 'Приложенные файлы',
    type: () => [File],
  })
  @OneToMany(() => File, (file: File) => file.message)
  public files: File[];
}
