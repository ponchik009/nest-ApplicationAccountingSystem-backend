import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from './role.entity';

@Entity()
export class Workgroup {
  @ApiProperty({ description: 'Уникальный идентификатор', example: 1 })
  @PrimaryGeneratedColumn()
  public id: number;

  @ApiProperty({
    description: 'Название рабочей группы',
    example: 'Системное администрирование',
  })
  @Column({ nullable: false, unique: true })
  public name: string;

  // @ApiProperty({
  //   description: 'Пользватели рабочей группы',
  //   type: () => [User],
  // })
  @OneToMany(() => User, (user: User) => user.workgroup)
  public users: User[];

  @ManyToOne(() => Role)
  public role: Role;
}
