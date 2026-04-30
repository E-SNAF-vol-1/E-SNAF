import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, QueryFailedError } from 'typeorm';
import { Product } from './product.entity';
import { ProductImage } from './product-image.entity';
import { User } from './user.entity';
import * as fs from 'fs/promises';
import * as path from 'path';
// sharp paketinin tipleri olmadığı için require kullanıldı
// eslint-disable-next-line @typescript-eslint/no-var-requires
const sharp = require('sharp');

interface ImageInput {
  gorsel_yolu: string;
  ana_gorsel_mi?: boolean;
}

type ImageBucket = 'buyuk' | 'orta' | 'kucuk';

interface ImageVariantDefinition {
  folder: ImageBucket;
  label: string;
  width: number | null;
  height: number | null;
  fit: 'cover' | 'contain';
  background?: { r: number; g: number; b: number; alpha: number };
}

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,

    // --- BUNU EKLE ---
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    // -----------------

    private readonly dataSource: DataSource,
  ) {}

  private readonly imageFolders: ImageBucket[] = ['buyuk', 'orta', 'kucuk'];

  private readonly imageVariants: ImageVariantDefinition[] = [
    {
      folder: 'buyuk',
      label: '400px',
      width: 1600,
      height: 400,
      fit: 'contain',
      background: { r: 255, g: 255, b: 255, alpha: 0 },
    },
    {
      folder: 'orta',
      label: '180px',
      width: 1200,
      height: 180,
      fit: 'contain',
      background: { r: 255, g: 255, b: 255, alpha: 0 },
    },
    {
      folder: 'kucuk',
      label: '110x110',
      width: 110,
      height: 110,
      fit: 'contain',
      background: { r: 255, g: 255, b: 255, alpha: 0 },
    },
  ];

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

  private async ensureUploadsDirs(): Promise<Record<ImageBucket, string>> {
    const baseDir = path.join(process.cwd(), 'uploads', 'products');
    const dirs = {
      buyuk: path.join(baseDir, 'buyuk'),
      orta: path.join(baseDir, 'orta'),
      kucuk: path.join(baseDir, 'kucuk'),
    } satisfies Record<ImageBucket, string>;

    await Promise.all(
      Object.values(dirs).map((dir) => fs.mkdir(dir, { recursive: true })),
    );

    return dirs;
  }

  private getPublicImagePath(folder: ImageBucket, filename: string): string {
    return `/uploads/products/${folder}/${filename}`;
  }

  private getDiskPathFromPublicPath(publicPath: string): string | null {
    if (!publicPath?.startsWith('/uploads/products/')) {
      return null;
    }

    const relativePath = publicPath
      .replace('/uploads/products/', '')
      .replace(/\//g, path.sep);

    return path.join(process.cwd(), 'uploads', 'products', relativePath);
  }

  private extractVariantBaseName(publicPath: string): string | null {
    const diskPath = this.getDiskPathFromPublicPath(publicPath);
    if (!diskPath) {
      return null;
    }

    const parsed = path.parse(diskPath);
    return parsed.name;
  }

  private async deletePhysicalImage(publicPath: string): Promise<void> {
    const baseName = this.extractVariantBaseName(publicPath);

    if (baseName) {
      await Promise.all(
        this.imageVariants.map(async (variant) => {
          const diskPath = path.join(
            process.cwd(),
            'uploads',
            'products',
            variant.folder,
            `${baseName}.webp`,
          );
          try {
            await fs.unlink(diskPath);
          } catch {
            // dosya zaten silinmiş olabilir
          }
        }),
      );
      return;
    }

    const diskPath = this.getDiskPathFromPublicPath(publicPath);
    if (!diskPath) return;
    try {
      await fs.unlink(diskPath);
    } catch {
      // dosya zaten silinmiş olabilir
    }
  }

  private buildWatermarkSvg(width: number, height: number): Buffer {
    const safeWidth = Math.max(width, 64);
    const safeHeight = Math.max(height, 64);
    const fontSize = Math.max(
      14,
      Math.round(Math.min(safeWidth, safeHeight) * 0.12),
    );
    const svg = `
      <svg width="${safeWidth}" height="${safeHeight}" xmlns="http://www.w3.org/2000/svg">
        <text
          x="50%"
          y="50%"
          text-anchor="middle"
          dominant-baseline="middle"
          font-family="Arial, Helvetica, sans-serif"
          font-size="${fontSize}"
          font-weight="700"
          fill="rgba(255,255,255,0.34)"
          stroke="rgba(0,0,0,0.22)"
          stroke-width="1"
        >e_snaf</text>
      </svg>
    `;
    return Buffer.from(svg);
  }

  private async createVariantImage(
    inputBuffer: Buffer,
    outputPath: string,
    variant: ImageVariantDefinition,
  ): Promise<void> {
    const targetWidth = variant.width ?? 1200;
    const targetHeight = variant.height ?? 400;

    await sharp(inputBuffer, { failOn: 'none' })
      .rotate()
      .resize({
        width: targetWidth,
        height: targetHeight,
        fit: variant.fit,
        position: 'centre',
        withoutEnlargement: false,
        background: variant.background ?? { r: 255, g: 255, b: 255, alpha: 1 },
      })
      .composite([
        {
          input: this.buildWatermarkSvg(targetWidth, targetHeight),
          gravity: 'center',
        },
      ])
      .webp({ quality: 90 })
      .toFile(outputPath);
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

    const uploadDirs = await this.ensureUploadsDirs();
    const existingCount = product.images?.length || 0;
    const baseName = this.slugify(product.urun_adi || `urun-${productId}`);
    const created: ProductImage[] = [];

    for (let i = 0; i < files.length; i++) {
      const sira = existingCount + i + 1;
      const variantBaseName = `${baseName}-${sira}`;

      for (const variant of this.imageVariants) {
        const fileName = `${variantBaseName}.webp`;
        const outputPath = path.join(uploadDirs[variant.folder], fileName);
        await this.createVariantImage(files[i].buffer, outputPath, variant);
      }

      const dbFileName = `${variantBaseName}.webp`;

      const image = await this.addImage(
        productId,
        this.getPublicImagePath('orta', dbFileName),
        existingCount === 0 && i === 0,
      );
      created.push(image);
    }

    return created;
  }

  async renameImageFile(
    imageId: number,
    yeniAd: string,
  ): Promise<ProductImage> {
    const image = await this.productImageRepository.findOne({
      where: { id: imageId },
    });
    if (!image) {
      throw new Error(`${imageId} ID'li görsel bulunamadı`);
    }

    const baseName = this.extractVariantBaseName(image.gorsel_yolu);
    if (!baseName) {
      throw new Error('Görsel dosya yolu geçersiz');
    }

    const oldPrefix = path.join(process.cwd(), 'uploads', 'products');
    const safeName = this.slugify(yeniAd);

    for (const variant of this.imageVariants) {
      const oldDiskPath = path.join(
        oldPrefix,
        variant.folder,
        `${baseName}.webp`,
      );
      const newDiskPath = path.join(
        oldPrefix,
        variant.folder,
        `${safeName}.webp`,
      );

      try {
        if (oldDiskPath !== newDiskPath) {
          await fs.rename(oldDiskPath, newDiskPath);
        }
      } catch {
        // bazı varyant dosyaları eksik olabilir
      }
    }

    const updatedPublicPath = this.getPublicImagePath(
      'orta',
      `${safeName}.webp`,
    );

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

  // --- MESAJ DURUMU GÜNCELLEME FONKSİYONU ---
  async updateUserMessageStatus(id: number, yeniDurum: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new Error(`${id} ID'li müşteri bulunamadı`);
    }

    await this.userRepository.update(id, {
      mesaj_durumu: yeniDurum,
    });
  }
  async getOrderDetails(orderId: number) {
    return await this.dataSource.query(`
      SELECT 
        s.id as siparis_id,
        s.toplam_fiyat,
        s.siparis_tarihi,
        s.durum,
        m.ad,
        m.soyad,
        m.email,
        m.telefon,
        sd.adet,
        sd.fiyat as birim_fiyat,
        u.urun_adi
      FROM siparis s
      JOIN musteri m ON s.musteri_id = m.id
      JOIN siparis_detay sd ON s.id = sd.siparis_id
      JOIN urun u ON sd.urun_id = u.id
      WHERE s.id = $1
    `, [Number(orderId)]);
  }
}