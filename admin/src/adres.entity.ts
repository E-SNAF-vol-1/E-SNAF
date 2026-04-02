import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('adres')
export class Adres {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  musteri_id: number;

  @Column({ type: 'text' })
  tam_adres: string;

  @ManyToOne(() => User, (user) => user.adresler)
  @JoinColumn({ name: 'musteri_id' })
  musteri: User;
}