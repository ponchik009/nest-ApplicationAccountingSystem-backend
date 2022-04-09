import { ApiProperty } from '@nestjs/swagger';
import { Workgroup } from 'src/workgroup/workgroup.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { GetGlobalReasonWithoutSubreasons } from '../dto/getGlobalReasonWithoutSubreasons.dto';
import { GlobalReason } from './globalReason.entity';

@Entity()
export class RequestReason {
  @ApiProperty({
    description: 'Уникальный идентификатор',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  public id: number;

  @ApiProperty({
    description: 'Название',
    example: 'Требуется консультация по работе с программой',
  })
  @Column({ nullable: false, unique: true })
  public name: string;

  @ApiProperty({
    description: 'Добавляется ли в заявку по этой причине название программы',
    example: true,
  })
  @Column({ default: false })
  public needsPrograms: boolean;

  @ApiProperty({
    description: 'Список глобальных причин, к которым можно отнести данную',
    type: () => [GetGlobalReasonWithoutSubreasons],
  })
  @ManyToMany(
    () => GlobalReason,
    (globalReason: GlobalReason) => globalReason.requestReasons,
  )
  public globalReasons: GlobalReason[];

  @ApiProperty({ description: 'Дефолтная рабочая группа для причины' })
  @ManyToOne(() => Workgroup)
  @JoinColumn()
  public defaultWorkgroup: Workgroup;
}
