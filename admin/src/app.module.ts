import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Admin } from './admin.entity';
import { Product } from './product.entity';
import { ProductImage } from './product-image.entity';
import { Kategori } from './kategori.entity';
import { AltKategori } from './alt_kategori.entity';
import { Siparis } from './siparis.entity'; // YENİ
import { SiparisDetay } from './siparis-detay.entity'; // YENİ

import { AdminController } from './admin.controller';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { SiparisService } from './siparis.service'; // YENİ

const dbHost = process.env.DB_HOST ?? 'localhost';
const dbPort = Number.parseInt(process.env.DB_PORT ?? '5432', 10);
const isSupabase = dbHost.includes('supabase.com');

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: dbHost,
      port: Number.isNaN(dbPort) ? 5432 : dbPort,
      username: process.env.DB_USER ?? 'postgres',
      password: process.env.DB_PASSWORD ?? '',
      database: process.env.DB_NAME ?? 'postgres',
      ssl: isSupabase ? { rejectUnauthorized: false } : false,
      // YENİ ENTITY'LERİ BURAYA EKLEDİK
      entities: [User, Admin, Product, ProductImage, Kategori, AltKategori, Siparis, SiparisDetay], 
      synchronize: false,
    }),
    TypeOrmModule.forFeature([
      User,
      Admin,
      Product,
      ProductImage,
      Kategori,
      AltKategori,
      Siparis, // YENİ
      SiparisDetay, // YENİ
    ]),
  ],
  controllers: [AdminController, ProductController],
  providers: [ProductService, SiparisService], // SİPARİŞ SERVİSİNİ EKLEDİK
})
export class AppModule {}