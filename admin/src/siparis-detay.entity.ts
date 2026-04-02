import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Siparis } from './siparis.entity';
import { Product } from './product.entity'; 

@Entity('siparis_detay')
export class SiparisDetay {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'siparis_id' })
  siparis_id: number;

  @Column({ name: 'urun_id' })
  urun_id: number;

  @Column('int')
  adet: number;

  @Column('numeric', { precision: 10, scale: 2 })
  birim_fiyat: number;

  
  @ManyToOne(() => Siparis, (siparis) => siparis.detaylar, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'siparis_id' })
  siparis: Siparis;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'urun_id' })
  urun: Product;
}