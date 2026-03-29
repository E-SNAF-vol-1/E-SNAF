/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  NotFoundException,
  BadRequestException,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ProductService } from './product.service';
import { Product } from './product.entity';
import { ProductImage } from './product-image.entity';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  async create(@Body() productData: Partial<Product>): Promise<Product> {
    if (!productData || Object.keys(productData).length === 0) {
      throw new BadRequestException('Ürün verisi boş olamaz');
    }
    delete productData.id;
    return this.productService.create(productData);
  }

  @Get()
  async findAll(): Promise<Product[]> {
    return this.productService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Product> {
    const parsedId = parseInt(id, 10);
    if (isNaN(parsedId)) {
      throw new BadRequestException('Geçersiz ID formatı');
    }
    const product = await this.productService.findById(parsedId);
    if (!product) {
      throw new NotFoundException(`${parsedId} ID'li ürün bulunamadı`);
    }
    return product;
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateData: Partial<Product>,
  ): Promise<Product> {
    const parsedId = parseInt(id, 10);
    if (isNaN(parsedId)) {
      throw new BadRequestException('Geçersiz ID formatı');
    }
    const updated = await this.productService.update(parsedId, updateData);
    if (!updated) {
      throw new NotFoundException(`${parsedId} ID'li ürün bulunamadı`);
    }
    return updated;
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<{ message: string }> {
    const parsedId = parseInt(id, 10);
    if (isNaN(parsedId)) {
      throw new BadRequestException('Geçersiz ID formatı');
    }
    await this.productService.delete(parsedId);
    return { message: 'Ürün başarıyla silindi' };
  }

  @Post(':id/images/upload')
  @UseInterceptors(
    FilesInterceptor('images', 20, {
      storage: memoryStorage(),
      limits: { fileSize: 10 * 1024 * 1024 },
      fileFilter: (_req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
          cb(new BadRequestException('Sadece resim dosyaları yüklenebilir'), false);
          return;
        }
        cb(null, true);
      },
    }),
  )
  async uploadImages(
    @Param('id') id: string,
    @UploadedFiles() files: any[],
  ): Promise<ProductImage[]> {
    const productId = parseInt(id, 10);
    if (isNaN(productId)) {
      throw new BadRequestException('Geçersiz ID formatı');
    }
    if (!files?.length) {
      throw new BadRequestException('En az bir görsel seçmelisiniz');
    }
    try {
      return await this.productService.uploadAndCreateImages(productId, files);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  // =========================
  // GÖRSEL YÖNETİMİ ENDPOİNTLERİ
  // =========================

  @Post(':id/images')
  async addImage(
    @Param('id') id: string,
    @Body() imageData: { gorsel_yolu: string; ana_gorsel_mi?: boolean },
  ): Promise<ProductImage> {
    const productId = parseInt(id, 10);
    if (isNaN(productId)) {
      throw new BadRequestException('Geçersiz ID formatı');
    }
    if (!imageData.gorsel_yolu) {
      throw new BadRequestException('Görsel yolu zorunludur');
    }
    try {
      return await this.productService.addImage(
        productId,
        imageData.gorsel_yolu,
        imageData.ana_gorsel_mi || false,
      );
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Post(':id/images/multiple')
  async addMultipleImages(
    @Param('id') id: string,
    @Body()
    data: { images: Array<{ gorsel_yolu: string; ana_gorsel_mi?: boolean }> },
  ): Promise<ProductImage[]> {
    const productId = parseInt(id, 10);
    if (isNaN(productId)) {
      throw new BadRequestException('Geçersiz ID formatı');
    }
    if (
      !data.images ||
      !Array.isArray(data.images) ||
      data.images.length === 0
    ) {
      throw new BadRequestException('Görsel listesi boş olamaz');
    }
    try {
      return await this.productService.addMultipleImages(
        productId,
        data.images,
      );
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Get(':id/images')
  async getProductImages(@Param('id') id: string): Promise<ProductImage[]> {
    const productId = parseInt(id, 10);
    if (isNaN(productId)) {
      throw new BadRequestException('Geçersiz ID formatı');
    }
    return await this.productService.getProductImages(productId);
  }

  @Put('images/:imageId')
  async updateImage(
    @Param('imageId') imageId: string,
    @Body() updateData: { ana_gorsel_mi?: boolean },
  ): Promise<ProductImage> {
    const parsedImageId = parseInt(imageId, 10);
    if (isNaN(parsedImageId)) {
      throw new BadRequestException('Geçersiz görsel ID formatı');
    }
    try {
      return await this.productService.updateImage(
        parsedImageId,
        updateData.ana_gorsel_mi,
      );
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Put('images/:imageId/rename')
  async renameImage(
    @Param('imageId') imageId: string,
    @Body() body: { yeni_ad: string },
  ): Promise<ProductImage> {
    const parsedImageId = parseInt(imageId, 10);
    if (isNaN(parsedImageId)) {
      throw new BadRequestException('Geçersiz görsel ID formatı');
    }
    if (!body?.yeni_ad?.trim()) {
      throw new BadRequestException('Yeni görsel adı boş olamaz');
    }
    try {
      return await this.productService.renameImageFile(parsedImageId, body.yeni_ad);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Delete('images/:imageId')
  async deleteImage(
    @Param('imageId') imageId: string,
  ): Promise<{ message: string }> {
    const parsedImageId = parseInt(imageId, 10);
    if (isNaN(parsedImageId)) {
      throw new BadRequestException('Geçersiz görsel ID formatı');
    }
    try {
      await this.productService.deleteImage(parsedImageId);
      return { message: 'Görsel başarıyla silindi' };
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Post('images/:imageId/set-main')
  async setMainImage(@Param('imageId') imageId: string): Promise<ProductImage> {
    const parsedImageId = parseInt(imageId, 10);
    if (isNaN(parsedImageId)) {
      throw new BadRequestException('Geçersiz görsel ID formatı');
    }
    try {
      return await this.productService.setMainImage(parsedImageId);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Delete(':id/images-all')
  async deleteProductImages(
    @Param('id') id: string,
  ): Promise<{ message: string }> {
    const productId = parseInt(id, 10);
    if (isNaN(productId)) {
      throw new BadRequestException('Geçersiz ID formatı');
    }
    try {
      const product = await this.productService.findById(productId);
      if (!product) {
        throw new NotFoundException(`${productId} ID'li ürün bulunamadı`);
      }
      await this.productService.deleteProductImages(productId);
      return { message: 'Tüm görseller başarıyla silindi' };
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
}
