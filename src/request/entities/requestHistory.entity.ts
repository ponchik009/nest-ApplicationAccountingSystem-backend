import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Request } from './request.entity';
import { RequestStage } from './requestStage.entity';

@Entity()
export class RequestHistory {
  @ApiProperty({ description: 'Уникальный идентификатор', example: 1 })
  @PrimaryGeneratedColumn()
  public id: number;

  @ApiProperty({
    description: 'Информация',
    example: 'Заявка создана и перешла в статус В ожидании',
  })
  @Column({ nullable: false, type: 'text' })
  public info: string;

  @ApiProperty({
    example: 'Tue, 15 Mar 2022 06:25:11 GMT',
    description:
      'Дата события (можно использовать new Date(Date.now()).toUTCString())',
  })
  @Column({ nullable: false })
  public date: Date;

  @ManyToOne(() => Request)
  @JoinColumn()
  public request: Request;

  @ManyToOne(() => RequestStage)
  @JoinColumn()
  public stage: RequestStage;
}
