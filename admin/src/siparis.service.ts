import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Siparis } from './siparis.entity';
import { SiparisDetay } from './siparis_detay.entity';
import { Product } from './product.entity';

@Injectable()
export class SiparisService {
  constructor(
    @InjectRepository(Siparis)
    private siparisRepository: Repository<Siparis>,
    @InjectRepository(SiparisDetay)
    private detayRepository: Repository<SiparisDetay>,
    private dataSource: DataSource,
  ) {}

  // 1. Tüm siparişleri listele (Admin Paneli için)
  async findAll() {
    return await this.siparisRepository.find({
      order: { siparis_tarihi: 'DESC' },
    });
  }

  // 2. Tekil sipariş ve ürün detaylarını getir
  async findOne(id: number) {
    const siparis = await this.siparisRepository.findOne({ where: { id } });
    const detaylar = await this.detayRepository.find({ where: { siparis_id: id } });
    return { ...siparis, urunler: detaylar };
  }

  // 3. Sipariş durumunu güncelle (Admin Paneli "Güncelle" butonu burayı tetikleyecek)
  async updateStatus(id: number, durum: string) {
    return await this.siparisRepository.update(id, { durum });
  }

  // 4. Yeni Sipariş Oluşturma (Transaction ve Stok Yönetimi)
  async createOrder(orderData: any, cartItems: any[]) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Sipariş Başlığını Oluştur
      const newOrder = this.siparisRepository.create({
        musteri_id: orderData.musteri_id || null,
        adres_id: orderData.adres_id || null,
        misafir_bilgileri: orderData.misafir_bilgileri || null,
        toplam_tutar: orderData.toplam_tutar,
        odeme_yontemi: orderData.odeme_yontemi,
        notlar: orderData.notlar,
        durum: 'Beklemede',
      });

      const savedOrder = await queryRunner.manager.save(newOrder);

      // Sipariş Detaylarını Ekle ve Stoktan Düş
      for (const item of cartItems) {
        // Detay kaydı
        const detail = this.detayRepository.create({
          siparis_id: savedOrder.id,
          urun_id: item.urun_id,
          adet: item.adet,
          birim_fiyat: item.fiyat,
        });
        await queryRunner.manager.save(detail);

        // Stok miktarını azalt
        await queryRunner.manager.decrement(
          Product, // Entity sınıfını direkt kullanmak daha güvenlidir
          { id: item.urun_id },
          'stok_adedi',
          item.adet
        );
      }

      await queryRunner.commitTransaction();
      return savedOrder;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}