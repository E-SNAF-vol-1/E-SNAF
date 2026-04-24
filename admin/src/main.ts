import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Kraliçe Ayarı 1: Tüm isteklerin başına /admin ekliyoruz ki Nginx ile tam uyumlu olsun
  app.setGlobalPrefix('admin');

  app.enableCors({
    // Buradaki URL'yi sunucu adresinizle güncellemeniz gerekebilir
    origin: process.env.CLIENT_URL ?? 'http://localhost:5173',
    credentials: true,
  });

  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads/',
  });

  // Kraliçe Ayarı 2: Varsayılan portu 3001 yapıyoruz, 3000 ile çakışmayı önlüyoruz
  const port = Number(process.env.PORT ?? 3001);
  await app.listen(port);

  console.log(`Admin paneli ${port} portunda ve /admin yolunda hazır!`);
}
void bootstrap();