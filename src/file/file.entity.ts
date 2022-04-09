import { ApiProperty } from '@nestjs/swagger';
import { Message } from 'src/message/message.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class File {
  @ApiProperty({
    description: 'Уникальный идентификатор',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  public id: number;

  @ApiProperty({
    description: 'Путь до файла',
    example: '/dist/file1.jpeg',
  })
  @Column({ nullable: false, unique: true })
  public path: string;

  @ManyToOne(() => Message)
  public message: Message;
}
