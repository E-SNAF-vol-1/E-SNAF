import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Siparis } from './siparis.entity';

@Entity('siparis_detay')
export class SiparisDetay {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  siparis_id: number;

  @Column()
  urun_id: number;

  @Column()
  adet: number;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  birim_fiyat: number;

  @ManyToOne(() => Siparis, (siparis) => siparis.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'siparis_id' })
  siparis: Siparis;
}