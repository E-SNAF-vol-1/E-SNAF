import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { AltKategori } from './alt_kategori.entity';

@Entity('kategori')
export class Kategori {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  kategori_adi: string;

  @Column({ default: true })
  aktif_mi: boolean;

  @OneToMany(() => AltKategori, (altKategori) => altKategori.kategori)
  alt_kategoriler: AltKategori[];
}
