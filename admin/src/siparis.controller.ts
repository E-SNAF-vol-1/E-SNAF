import { Controller, Post, Body, Get, Param, BadRequestException } from '@nestjs/common';
import { SiparisService } from './siparis.service';

@Controller('siparis')
export class SiparisController {
  constructor(private readonly siparisService: SiparisService) {}

  // 1. Yeni Sipariş Oluşturma (Üye veya Misafir)
  // POST http://localhost:3000/siparis/olustur
  @Post('olustur')
  async create(@Body() body: { orderData: any; cartItems: any[] }) {
    const { orderData, cartItems } = body;

    if (!cartItems || cartItems.length === 0) {
      throw new BadRequestException('Sepetiniz boş olamaz.');
    }

    return await this.siparisService.createOrder(orderData, cartItems);
  }

  // 2. Tüm Siparişleri Listele (Admin Paneli İçin)
  // GET http://localhost:3000/siparis/liste
  @Get('liste')
  async getAll() {
    return await this.siparisService.findAll();
  }

  // 3. Sipariş Detayı Görüntüleme
  // GET http://localhost:3000/siparis/detay/:id
  @Get('detay/:id')
  async getDetail(@Param('id') id: number) {
    return await this.siparisService.findOne(id);
  }

  // 4. Sipariş Durumu Güncelleme (Admin Paneli İçin)
  // POST http://localhost:3000/siparis/guncelle/:id
  @Post('guncelle/:id')
  async update(@Param('id') id: number, @Body('durum') durum: string) {
    // Servis tarafındaki yeni updateStatus metoduna uygun olarak sadece durum gönderiyoruz
    return await this.siparisService.updateStatus(id, durum);
  }
}