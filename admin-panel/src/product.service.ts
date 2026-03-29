import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, QueryFailedError } from 'typeorm';
import { Product } from './product.entity';
import { ProductImage } from './product-image.entity';
import * as fs from 'fs/promises';
import * as path from 'path';
// sharp paketinin tipleri olmadığı için require kullanıldı
// eslint-disable-next-line @typescript-eslint/no-var-requires
const sharp = require('sharp');

interface ImageInput {
  gorsel_yolu: string;
  ana_gorsel_mi?: boolean;
}

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
    private readonly dataSource: DataSource,
  ) {}

  async create(productData: Partial<Product>): Promise<Product> {
    delete productData.id;
    const product = this.productRepository.create(productData);

    try {
      return await this.productRepository.save(product);
    } catch (error) {
      if (!(error instanceof QueryFailedError)) {
        throw error;
      }

      const driverError = error.driverError as {
        code?: string;
        constraint?: string;
      };

      if (
        driverError?.code !== '23505' ||
        driverError?.constraint !== 'urun_pkey'
      ) {
        throw error;
      }

      await this.dataSource.query(`
        SELECT setval(
          pg_get_serial_sequence('urun', 'id'),
          COALESCE((SELECT MAX(id) FROM urun), 0) + 1,
          false
        );
      `);

      const retryProduct = this.productRepository.create(productData);
      return await this.productRepository.save(retryProduct);
    }
  }

  private async syncProductImageIdSequence(): Promise<void> {
    await this.dataSource.query(`
      SELECT setval(
        pg_get_serial_sequence('urun_gorsel', 'id'),
        COALESCE((SELECT MAX(id) FROM urun_gorsel), 0) + 1,
        false
      );
    `);
  }

  async findAll(): Promise<Product[]> {
    return await this.productRepository.find({
      order: { id: 'DESC' },
    });
  }

  async findById(id: number): Promise<Product | null> {
    return await this.productRepository.findOne({
      where: { id },
      relations: ['images'],
    });
  }

  async update(
    id: number,
    updateData: Partial<Product>,
  ): Promise<Product | null> {
    await this.productRepository.update(id, updateData);
    return await this.productRepository.findOne({
      where: { id },
      relations: ['images'],
    });
  }

  async delete(id: number): Promise<void> {
    const images = await this.getProductImages(id);
    for (const image of images) {
      await this.deletePhysicalImage(image.gorsel_yolu);
    }
    await this.productRepository.delete(id);
  }

  async getAllForAdmin(): Promise<Product[]> {
    return await this.productRepository.find({
      order: { id: 'DESC' },
    });
  }

  async getStatistics(): Promise<{
    totalProducts: number;
    totalValue: number;
    lowStockProducts: number;
  }> {
    const products = await this.productRepository.find();
    const totalProducts = products.length;
    const totalValue = products.reduce(
      (sum, p) => sum + p.fiyat * p.stok_adedi,
      0,
    );
    const lowStockProducts = products.filter((p) => p.stok_adedi < 10).length;

    return {
      totalProducts,
      totalValue,
      lowStockProducts,
    };
  }

  private slugify(value: string): string {
    return (value || 'urun')
      .toLocaleLowerCase('tr-TR')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/ı/g, 'i')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'urun';
  }

  private async ensureUploadsDir(): Promise<string> {
    const dir = path.join(process.cwd(), 'uploads', 'products');
    await fs.mkdir(dir, { recursive: true });
    return dir;
  }

  private getPublicImagePath(filename: string): string {
    return `/uploads/products/${filename}`;
  }

  private getDiskPathFromPublicPath(publicPath: string): string | null {
    if (!publicPath?.startsWith('/uploads/products/')) {
      return null;
    }
    return path.join(
      process.cwd(),
      'uploads',
      'products',
      publicPath.replace('/uploads/products/', ''),
    );
  }

  private async deletePhysicalImage(publicPath: string): Promise<void> {
    const diskPath = this.getDiskPathFromPublicPath(publicPath);
    if (!diskPath) return;
    try {
      await fs.unlink(diskPath);
    } catch {
      // dosya zaten silinmiş olabilir
    }
  }

  async uploadAndCreateImages(
    productId: number,
    files: any[],
  ): Promise<ProductImage[]> {
    const product = await this.productRepository.findOne({
      where: { id: productId },
      relations: ['images'],
    });
    if (!product) {
      throw new Error(`${productId} ID'li ürün bulunamadı`);
    }

    if (!files || files.length === 0) {
      return [];
    }

    const uploadsDir = await this.ensureUploadsDir();
    const existingCount = product.images?.length || 0;
    const baseName = this.slugify(product.urun_adi || `urun-${productId}`);
    const created: ProductImage[] = [];

    for (let i = 0; i < files.length; i++) {
      const sıra = existingCount + i + 1;
      const fileName = `${baseName}-${sıra}.webp`;
      const outputPath = path.join(uploadsDir, fileName);

      await sharp(files[i].buffer)
        .resize(110, 110, {
          fit: 'cover',
          position: 'centre',
        })
        .webp({ quality: 90 })
        .toFile(outputPath);

      const image = await this.addImage(
        productId,
        this.getPublicImagePath(fileName),
        existingCount === 0 && i === 0,
      );
      created.push(image);
    }

    return created;
  }

  async renameImageFile(imageId: number, yeniAd: string): Promise<ProductImage> {
    const image = await this.productImageRepository.findOne({
      where: { id: imageId },
    });
    if (!image) {
      throw new Error(`${imageId} ID'li görsel bulunamadı`);
    }

    const diskPath = this.getDiskPathFromPublicPath(image.gorsel_yolu);
    if (!diskPath) {
      throw new Error('Görsel dosya yolu geçersiz');
    }

    const ext = path.extname(diskPath) || '.webp';
    const dir = path.dirname(diskPath);
    const safeName = this.slugify(yeniAd);
    const newDiskPath = path.join(dir, `${safeName}${ext}`);

    if (diskPath !== newDiskPath) {
      await fs.rename(diskPath, newDiskPath);
    }

    const updatedPublicPath = this.getPublicImagePath(`${safeName}${ext}`);
    await this.productImageRepository.update(imageId, {
      gorsel_yolu: updatedPublicPath,
    });

    return (await this.productImageRepository.findOne({
      where: { id: imageId },
    })) as ProductImage;
  }

  async addImage(
    productId: number,
    gorsel_yolu: string,
    ana_gorsel_mi: boolean = false,
  ): Promise<ProductImage> {
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });
    if (!product) {
      throw new Error(`${productId} ID'li ürün bulunamadı`);
    }

    if (ana_gorsel_mi) {
      await this.productImageRepository.update(
        { urun_id: productId, ana_gorsel_mi: true },
        { ana_gorsel_mi: false },
      );
    }

    const imageData = {
      urun_id: productId,
      gorsel_yolu,
      ana_gorsel_mi,
    };

    try {
      const image = this.productImageRepository.create(imageData);
      return await this.productImageRepository.save(image);
    } catch (error) {
      if (!(error instanceof QueryFailedError)) {
        throw error;
      }

      const driverError = error.driverError as {
        code?: string;
        constraint?: string;
      };

      if (
        driverError?.code !== '23505' ||
        driverError?.constraint !== 'urun_gorsel_pkey'
      ) {
        throw error;
      }

      await this.syncProductImageIdSequence();

      const retryImage = this.productImageRepository.create(imageData);
      return await this.productImageRepository.save(retryImage);
    }
  }


  async addMultipleImages(
    productId: number,
    images: ImageInput[],
  ): Promise<ProductImage[]> {
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });
    if (!product) {
      throw new Error(`${productId} ID'li ürün bulunamadı`);
    }

    const hasMainImage = images.some((img) => img.ana_gorsel_mi);
    if (hasMainImage) {
      await this.productImageRepository.update(
        { urun_id: productId, ana_gorsel_mi: true },
        { ana_gorsel_mi: false },
      );
    }

    const imageDataList = images.map((img) => ({
      urun_id: productId,
      gorsel_yolu: img.gorsel_yolu,
      ana_gorsel_mi: img.ana_gorsel_mi || false,
    }));

    try {
      const createdImages = imageDataList.map((img) =>
        this.productImageRepository.create(img),
      );
      return await this.productImageRepository.save(createdImages);
    } catch (error) {
      if (!(error instanceof QueryFailedError)) {
        throw error;
      }

      const driverError = error.driverError as {
        code?: string;
        constraint?: string;
      };

      if (
        driverError?.code !== '23505' ||
        driverError?.constraint !== 'urun_gorsel_pkey'
      ) {
        throw error;
      }

      await this.syncProductImageIdSequence();

      const retryImages = imageDataList.map((img) =>
        this.productImageRepository.create(img),
      );
      return await this.productImageRepository.save(retryImages);
    }
  }

  async getProductImages(productId: number): Promise<ProductImage[]> {
    return await this.productImageRepository.find({
      where: { urun_id: productId },
      order: { ana_gorsel_mi: 'DESC', id: 'ASC' },
    });
  }

  async updateImage(
    imageId: number,
    ana_gorsel_mi?: boolean,
  ): Promise<ProductImage> {
    const image = await this.productImageRepository.findOne({
      where: { id: imageId },
    });
    if (!image) {
      throw new Error(`${imageId} ID'li görsel bulunamadı`);
    }

    if (ana_gorsel_mi) {
      await this.productImageRepository.update(
        { urun_id: image.urun_id, ana_gorsel_mi: true },
        { ana_gorsel_mi: false },
      );
    }

    const updateData: Partial<ProductImage> = {};
    if (ana_gorsel_mi !== undefined) updateData.ana_gorsel_mi = ana_gorsel_mi;

    await this.productImageRepository.update(imageId, updateData);
    return (await this.productImageRepository.findOne({
      where: { id: imageId },
    })) as ProductImage;
  }

  async deleteImage(imageId: number): Promise<void> {
    const image = await this.productImageRepository.findOne({
      where: { id: imageId },
    });
    if (!image) {
      throw new Error(`${imageId} ID'li görsel bulunamadı`);
    }
    await this.deletePhysicalImage(image.gorsel_yolu);
    await this.productImageRepository.delete(imageId);
  }

  async deleteProductImages(productId: number): Promise<void> {
    const images = await this.getProductImages(productId);
    for (const image of images) {
      await this.deletePhysicalImage(image.gorsel_yolu);
    }
    await this.productImageRepository.delete({ urun_id: productId });
  }

  async setMainImage(imageId: number): Promise<ProductImage> {
    const image = await this.productImageRepository.findOne({
      where: { id: imageId },
    });
    if (!image) {
      throw new Error(`${imageId} ID'li görsel bulunamadı`);
    }

    await this.productImageRepository.update(
      { urun_id: image.urun_id, ana_gorsel_mi: true },
      { ana_gorsel_mi: false },
    );

    await this.productImageRepository.update(imageId, { ana_gorsel_mi: true });
    return (await this.productImageRepository.findOne({
      where: { id: imageId },
    })) as ProductImage;
  }
}
