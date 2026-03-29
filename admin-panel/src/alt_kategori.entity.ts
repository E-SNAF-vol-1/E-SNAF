import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Kategori } from './kategori.entity';

@Entity('alt_kategori')
export class AltKategori {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ana_kategori_id: number;

  @ManyToOne(() => Kategori, (kategori) => kategori.alt_kategoriler, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'ana_kategori_id' })
  kategori: Kategori;

  @Column({ length: 100 })
  alt_kategori_adi: string;

  @Column({ default: true })
  aktif_mi: boolean;
}
