import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from './user.entity'; 
import { Adres } from './adres.entity'; 
import { SiparisDetay  } from './siparis-detay.entity';

@Entity('siparis')
export class Siparis {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'musteri_id' })
  musteri_id: number;

  @Column({ name: 'adres_id' })
  adres_id: number;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  toplam_tutar: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  siparis_tarihi: Date;

  @Column({ length: 50, default: 'Hazırlanıyor' })
  durum: string;

  // --- İLİŞKİLER ---

  @OneToMany(() => SiparisDetay, (detay) => detay.siparis)
  detaylar: SiparisDetay[]; 

  @ManyToOne(() => User, (user) => user.siparisler) 
  @JoinColumn({ name: 'musteri_id' })
  musteri: User; 

  @ManyToOne(() => Adres)
  @JoinColumn({ name: 'adres_id' })
  adres: Adres;
}