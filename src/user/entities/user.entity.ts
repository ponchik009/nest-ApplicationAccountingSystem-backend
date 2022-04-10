import { ApiProperty } from '@nestjs/swagger';
import { Workgroup } from 'src/workgroup/entities/workgroup.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @ApiProperty({ description: 'Уникальный идентификатор', example: 1 })
  @PrimaryGeneratedColumn()
  public id: number;

  @ApiProperty({ description: 'ФИО', example: 'Иванов Иван Иванович' })
  @Column({ nullable: false })
  public name: string;

  @ApiProperty({ description: 'Почта', example: 'user@mail.ru' })
  @Column({ select: false, nullable: false, unique: true })
  public email: string;

  @ApiProperty({ description: 'Логин', example: 'ponchik009' })
  @Column({ nullable: false, unique: true })
  public login: string;

  @ApiProperty({ description: 'Хешированный пароль', example: 'qwerty123' })
  @Column({ select: false, nullable: false })
  public password: string;

  @ApiProperty({ description: 'Никнейм телеграма', example: 'luxorylife' })
  @Column({ nullable: true, unique: true })
  public telegram: string;

  @ApiProperty({
    description: 'Рабочая группа пользователя',
    type: () => Workgroup,
  })
  @ManyToOne(() => Workgroup, (workgroup: Workgroup) => workgroup.users)
  @JoinColumn()
  public workgroup: Workgroup;
}
