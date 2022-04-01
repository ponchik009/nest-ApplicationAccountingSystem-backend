import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

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

  @ApiProperty({
    description: 'Пользватели рабочей группы',
    type: () => [User],
  })
  @OneToMany(() => User, (user: User) => user.workgroup)
  public users: User[];
}
