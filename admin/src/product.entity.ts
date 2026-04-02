import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ProductImage } from './product-image.entity';

@Entity('urun')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  alt_kategori_id: number;

  @Column({ length: 200 })
  urun_adi: string;

  @Column('text', { nullable: true })
  aciklama: string;

  @Column('decimal', { precision: 10, scale: 2 })
  fiyat: number;

  @Column({ default: 0 })
  stok_adedi: number;

  @OneToMany(() => ProductImage, (image) => image.product, {
    cascade: true,
    eager: false,
  })
  images: ProductImage[];
}
