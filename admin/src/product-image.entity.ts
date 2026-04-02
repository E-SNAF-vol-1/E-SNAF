import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Product } from './product.entity';

@Entity('urun_gorsel')
export class ProductImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  urun_id: number;

  @Column('text')
  gorsel_yolu: string;

  @Column({ default: false })
  ana_gorsel_mi: boolean;

  @ManyToOne(() => Product, (product) => product.images, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'urun_id' })
  product: Product;
}
