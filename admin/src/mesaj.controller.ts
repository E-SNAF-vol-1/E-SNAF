import { Controller, Get, Post, Param } from '@nestjs/common';
import { MesajService } from './mesaj.service';

@Controller('mesaj')
export class MesajController {
  constructor(private readonly mesajService: MesajService) {}

  @Get('liste')
  async getAll() {
    return await this.mesajService.findAll();
  }

  @Get('detay/:id')
  async getOne(@Param('id') id: number) {
    await this.mesajService.okunduYap(id); // Detayına bakılınca okundu olsun
    return await this.mesajService.findOne(id);
  }
}