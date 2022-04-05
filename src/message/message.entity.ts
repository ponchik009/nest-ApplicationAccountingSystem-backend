import { ApiProperty } from '@nestjs/swagger';
import { File } from 'src/file/file.entity';
import { Request } from 'src/request/entities/request.entity';
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
  @PrimaryGeneratedColumn()
  public id: number;

  @ApiProperty({
    description: 'Текст сообщения',
    example:
      'В школе меня бросила девушка потому что сказала что я не настоящий дед инсайд если я попаду в психокидс то она поймёт что я настоящий гуль тру канеки ссс +баран бананаранга',
  })
  @Column()
  public text: string;

  @ManyToOne(() => User)
  public user: User;

  @ManyToOne(() => Request)
  public request: Request;

  @OneToMany(() => File, (file: File) => file.message)
  public files: File[];
}
