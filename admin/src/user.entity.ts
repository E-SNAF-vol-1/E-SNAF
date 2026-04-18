import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

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
}
