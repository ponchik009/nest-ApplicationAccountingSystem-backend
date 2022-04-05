import { ApiProperty } from '@nestjs/swagger';
import { Message } from 'src/message/message.entity';
import { RequestReason } from 'src/reasons/entities/requestReason.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { workerData } from 'worker_threads';
import { RequestStage } from './requestStage.entity';
import { RequestWork } from './requestWorks.entity';

@Entity()
export class Request {
  @ApiProperty({ description: 'Уникальный идентификатор', example: 1 })
  @PrimaryGeneratedColumn()
  public id: number;

  @ApiProperty({
    description: 'Сформированное название заявки',
    example:
      'Требуется консультация по работе с программой 1С:Управление персоналом',
  })
  @Column({ nullable: false })
  public specific_name: string;

  @ApiProperty({
    example: 'Tue, 15 Mar 2022 06:25:11 GMT',
    description:
      'Дата создания заявки (можно использовать new Date(Date.now()).toUTCString())',
  })
  @Column({ nullable: false })
  public date: Date;

  @ManyToOne(() => RequestStage)
  @JoinColumn()
  public stage: RequestStage;

  @ManyToOne(() => User)
  @JoinColumn()
  public user: User;

  @ManyToOne(() => RequestReason)
  @JoinColumn()
  public reason: RequestReason;

  @OneToMany(() => RequestWork, (work: RequestWork) => work.request)
  public works: RequestWork[];

  @OneToMany(() => Message, (message: Message) => message.request)
  public messages: Message[];
}
