import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Program {
  @ApiProperty({
    description: 'Уникальный идентификатор',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  public id: number;

  @ApiProperty({
    description: 'Название программы',
    example: '1С: Управление персоналом',
  })
  @Column({ nullable: false, unique: true })
  public name: string;
}
