import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Siparis } from './siparis.entity';

@Injectable()
export class SiparisService {
  constructor(
    @InjectRepository(Siparis)
    private siparisRepository: Repository<Siparis>,
  ) {}

  
  async findAll(): Promise<Siparis[]> {
    return await this.siparisRepository.find({
      relations: ['musteri', 'detaylar'], 
      order: { id: 'DESC' } 
    });
  }

  
  async getSiparisDetayiAdmin(id: number): Promise<Siparis> {
    const siparis = await this.siparisRepository.findOne({
      where: { id },
      relations: ['detaylar', 'detaylar.urun', 'musteri', 'adres'],
    });

    if (!siparis) {
      throw new NotFoundException(`ID'si ${id} olan sipariş bulunamadı.`);
    }

    return siparis;
  }
}