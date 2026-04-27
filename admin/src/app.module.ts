import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Admin } from './admin.entity';
import { Product } from './product.entity';
import { ProductImage } from './product-image.entity';
import { Kategori } from './kategori.entity';
import { AltKategori } from './alt_kategori.entity';
import { Siparis } from './siparis.entity';
import { SiparisDetay } from './siparis_detay.entity';
// Mesaj Entity'sini import et
import { Mesaj } from './mesaj.entity'; 

import { AdminController } from './admin.controller';
import { ProductController } from './product.controller';
import { SiparisController } from './siparis.controller';
// Mesaj Controller'ı import et
import { MesajController } from './mesaj.controller'; 

import { ProductService } from './product.service';
import { SiparisService } from './siparis.service';
// Mesaj Servisi import et
import { MesajService } from './mesaj.service'; 

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
      entities: [
        User, 
        Admin, 
        Product, 
        ProductImage, 
        Kategori, 
        AltKategori, 
        Siparis, 
        SiparisDetay,
        Mesaj 
      ],
      synchronize: false, 
    }),
    TypeOrmModule.forFeature([
      User,
      Admin,
      Product,
      ProductImage,
      Kategori,
      AltKategori,
      Siparis,
      SiparisDetay,
      Mesaj 
    ]),
  ],
  controllers: [
    AdminController, 
    ProductController, 
    SiparisController, 
    MesajController // 3. Kontrolcüyü ekledik
  ],
  providers: [
    ProductService, 
    SiparisService, 
    MesajService // 4. Servisi ekledik
  ],
})
export class AppModule {}