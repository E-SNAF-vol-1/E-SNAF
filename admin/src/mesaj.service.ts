import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mesaj } from './mesaj.entity';

@Injectable()
export class MesajService {
  constructor(
    @InjectRepository(Mesaj)
    private mesajRepository: Repository<Mesaj>,
  ) {}

  findAll() {
    return this.mesajRepository.find({ order: { tarih: 'DESC' } });
  }

  findOne(id: number) {
    return this.mesajRepository.findOne({ where: { id } });
  }

  async okunduYap(id: number) {
    await this.mesajRepository.update(id, { durum: 'Okundu' });
    return { success: true };
  }
}