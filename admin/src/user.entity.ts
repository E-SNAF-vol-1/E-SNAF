import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany, 
} from 'typeorm';

import { Adres } from './adres.entity'; 
import { Siparis } from './siparis.entity';

@Entity('musteri') 
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  ad: string;

  @Column({ nullable: true })
  soyad: string;

  @Column({ unique: true })
  email: string;

  @Column()
  sifre: string;

  @Column({ nullable: true })
  telefon: string;

  @CreateDateColumn()
  kayit_tarihi: Date;

  

  
  @OneToMany(() => Adres, (adres) => adres.musteri)
  adresler: Adres[];

  
  @OneToMany(() => Siparis, (siparis) => siparis.musteri)
  siparisler: Siparis[];
}