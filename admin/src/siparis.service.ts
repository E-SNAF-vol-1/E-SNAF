import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Siparis } from './siparis.entity';
import { SiparisDetay } from './siparis_detay.entity';
import { Product } from './product.entity'; // Stok güncelleme için ekledik

@Injectable()
export class SiparisService {
  constructor(
    @InjectRepository(Siparis)
    private siparisRepository: Repository<Siparis>,
    @InjectRepository(SiparisDetay)
    private detayRepository: Repository<SiparisDetay>,
    private dataSource: DataSource,
  ) {}

  // Tüm siparişleri listele
  async findAll() {
    return await this.siparisRepository.find({
      order: { siparis_tarihi: 'DESC' },
    });
  }

  // Tekil sipariş getir
  async findOne(id: number) {
    const siparis = await this.siparisRepository.findOne({ where: { id } });
    const detaylar = await this.detayRepository.find({ where: { siparis_id: id } });
    return { ...siparis, urunler: detaylar };
  }

  // Sipariş durumunu güncelle (Tek bir tane kalmalı)
  async updateStatus(id: number, yeniDurum: string, kargoNo?: string) {
    return await this.siparisRepository.update(id, { 
      durum: yeniDurum, 
      kargo_no: kargoNo 
    });
  }

  async createOrder(orderData: any, cartItems: any[]) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Sipariş Başlığını Oluştur
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

      // 2. Sipariş Detaylarını Ekle ve Stoktan Düş
      for (const item of cartItems) {
        // Detay kaydı
        const detail = this.detayRepository.create({
          siparis_id: savedOrder.id,
          urun_id: item.urun_id,
          adet: item.adet,
          birim_fiyat: item.fiyat,
        });
        await queryRunner.manager.save(detail);

        // --- EKSTRA: Stoktan Düşme Mantığı ---
        // Ürünü bul ve stok miktarını azalt
        await queryRunner.manager.decrement(
          'Product', // Ürün tablonun adı (Product entity'deki gibi)
          { id: item.urun_id },
          'stok_adedi', // Veritabanındaki kolon adı
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