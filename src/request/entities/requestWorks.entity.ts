import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/user/entities/user.entity';
import { Workgroup } from 'src/workgroup/entities/workgroup.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { GetRequest } from '../dto/getRequest.dto';
import { Request } from './request.entity';

@Entity()
export class RequestWork {
  @ApiProperty({ description: 'Уникальный идентификатор', example: 1 })
  @PrimaryGeneratedColumn()
  public id: number;

  @ApiProperty({
    example: 'Tue, 15 Mar 2022 06:25:11 GMT',
    description:
      'Дата закрытия работы (можно использовать new Date(Date.now()).toUTCString())',
  })
  @Column({ nullable: true })
  public dateOfEnd: Date;

  @ApiProperty({
    description: 'Заявка, по которой создана работа',
    type: () => GetRequest,
  })
  @ManyToOne(() => Request)
  @JoinColumn()
  public request: Request;

  @ManyToOne(() => User)
  @JoinColumn()
  public user: User;

  @ManyToOne(() => Workgroup)
  @JoinColumn()
  public workgroup: Workgroup;
}
