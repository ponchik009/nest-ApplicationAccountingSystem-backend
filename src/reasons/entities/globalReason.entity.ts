import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RequestReason } from './requestReason.entity';

@Entity()
export class GlobalReason {
  @ApiProperty({
    description: 'Уникальный идентификатор',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  public id: number;

  @ApiProperty({
    description: 'Название',
    example: 'Проблема с работой программы',
  })
  @Column({ nullable: false, unique: true })
  public name: string;

  @ApiProperty({
    description: 'Список причин, которые можно сгруппировать под этой',
    example: [
      {
        id: 1,
        name: 'Требуется консультация',
      },
    ],
  })
  @ManyToMany(
    () => RequestReason,
    (requestReason: RequestReason) => requestReason.globalReasons,
  )
  @JoinTable()
  public requestReasons: RequestReason[];
}
