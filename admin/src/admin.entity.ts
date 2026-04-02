import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('yonetim_hesaplari')
export class Admin {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  kullanici_adi: string;

  @Column()
  sifre: string;

  @Column({ default: 'editor' })
  rol: string;
}
