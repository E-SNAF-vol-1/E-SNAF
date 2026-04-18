import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Admin } from './admin.entity';
import { Product } from './product.entity';
import { ProductImage } from './product-image.entity';
import { Kategori } from './kategori.entity';
import { AltKategori } from './alt_kategori.entity';
import { AdminController } from './admin.controller';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

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
      entities: [User, Admin, Product, ProductImage, Kategori, AltKategori],
      synchronize: false,
    }),
    TypeOrmModule.forFeature([
      User,
      Admin,
      Product,
      ProductImage,
      Kategori,
      AltKategori,
    ]),
  ],
  controllers: [AdminController, ProductController],
  providers: [ProductService],
})
export class AppModule {}
