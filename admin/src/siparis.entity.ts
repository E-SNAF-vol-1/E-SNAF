import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity'; // User entity adın neyse ona göre import et

@Entity('siparis')
export class Siparis {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  musteri_id: number;

  @Column({ nullable: true })
  adres_id: number;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  toplam_tutar: number;

  @CreateDateColumn()
  siparis_tarihi: Date;

  @Column({ length: 50, default: 'Hazırlanıyor' })
  durum: string;

  @Column({ type: 'text', nullable: true })
  notlar: string;

  // Yeni eklediğimiz alanlar
  @Column({ type: 'jsonb', nullable: true })
  misafir_bilgileri: any;

  @Column({ length: 30, nullable: true })
  odeme_yontemi: string;

  @Column({ default: false })
  odeme_durumu: boolean;

  @Column({ nullable: true })
  kargo_no: string;

  @Column({ nullable: true })
  kargo_firmasi: string;

  // İlişki (Opsiyonel: Eğer User entity ile bağlamak istersen)
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'musteri_id' })
  musteri: User;
}