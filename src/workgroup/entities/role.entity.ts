import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Role {
  @ApiProperty({ description: 'Уникальный идентификатор', example: 1 })
  @PrimaryGeneratedColumn()
  public id: number;

  @ApiProperty({
    description: 'Название роли',
    example: 'Администратор',
  })
  @Column({ nullable: false, unique: true })
  public name: string;
}
