import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('mesajlar')
export class Mesaj {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ad_soyad: string;

  @Column()
  eposta: string;

  @Column()
  konu: string;

  @Column({ type: 'text' })
  mesaj: string;

  @CreateDateColumn()
  tarih: Date;

  @Column({ default: 'Okunmadı' })
  durum: string; 
}