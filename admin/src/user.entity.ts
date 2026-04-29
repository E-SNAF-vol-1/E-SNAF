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

  // Email zorunluluğu için nullable: true kaldırıldı
  @Column({ unique: true }) 
  email: string;

  @Column()
  sifre: string;

  @Column({ nullable: true })
  telefon: string;

  @CreateDateColumn()
  kayit_tarihi: Date;

  // Veritabanındaki "son_mesaj" kolonuyla eşleşmesi şart:
  @Column({ type: 'text', nullable: true })
  son_mesaj: string; 

  @Column({ default: 'Okunmadı' })
  mesaj_durumu: string;

  @Column({ type: 'timestamp', nullable: true })
  mesaj_tarihi: Date;
}