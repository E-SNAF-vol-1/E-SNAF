/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Controller, Get, Post, Body, Res, Param, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Admin } from './admin.entity';
import { Product } from './product.entity';
import { Kategori } from './kategori.entity';
import { AltKategori } from './alt_kategori.entity';
import { ProductService } from './product.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

const CSS_STYLES = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    padding: 20px;
  }
  
  .container {
    max-width: 1400px;
    margin: 0 auto;
  }
  
  .header {
    background: rgba(255, 255, 255, 0.95);
    padding: 20px 30px;
    border-radius: 10px;
    margin-bottom: 30px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .header h1 {
    color: #333;
    font-size: 28px;
  }
  
  .header .logout {
    background: #e74c3c;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 14px;
    transition: background 0.3s;
  }
  
  .header .logout:hover {
    background: #c0392b;
  }
  
  .login-container {
    max-width: 400px;
    margin: 100px auto;
    background: white;
    padding: 40px;
    border-radius: 10px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  }
  
  .login-container h2 {
    color: #333;
    margin-bottom: 30px;
    text-align: center;
    font-size: 24px;
  }
  
  .login-container .form-group {
    margin-bottom: 20px;
  }
  
  .login-container input {
    width: 100%;
    padding: 12px;
    border: 2px solid #e0e0e0;
    border-radius: 5px;
    font-size: 14px;
    transition: border-color 0.3s;
  }
  
  .login-container input:focus {
    outline: none;
    border-color: #667eea;
  }
  
  .login-container button {
    width: 100%;
    padding: 12px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    transition: transform 0.2s;
  }
  
  .login-container button:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }
  
  .tabs {
    display: flex;
    gap: 10px;
    margin-bottom: 30px;
  }
  
  .tab-btn {
    padding: 12px 20px;
    background: rgba(255, 255, 255, 0.8);
    border: 2px solid #667eea;
    border-radius: 5px;
    cursor: pointer;
    font-size: 14px;
    font-weight: bold;
    color: #667eea;
    transition: all 0.3s;
  }
  
  .tab-btn.active {
    background: #667eea;
    color: white;
  }
  
  .tab-content {
    display: none;
    background: white;
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  .tab-content.active {
    display: block;
  }
  
  .dashboard {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    margin-bottom: 30px;
  }
  
  .stat-card {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 20px;
    border-radius: 8px;
    text-align: center;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  .stat-card h3 {
    font-size: 30px;
    margin-bottom: 10px;
  }
  
  .stat-card p {
    font-size: 12px;
    opacity: 0.9;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
  }
  
  table th {
    background: #667eea;
    color: white;
    padding: 12px;
    text-align: left;
    font-weight: bold;
  }
  
  table td {
    padding: 12px;
    border-bottom: 1px solid #e0e0e0;
  }
  
  table tr:hover {
    background: #f5f5f5;
  }
  
  .btn {
    padding: 8px 12px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
    font-weight: bold;
    transition: all 0.3s;
    margin-right: 5px;
  }
  
  .btn-approve {
    background: #27ae60;
    color: white;
  }
  
  .btn-approve:hover {
    background: #229954;
  }
  
  .btn-edit {
    background: #3498db;
    color: white;
  }
  
  .btn-edit:hover {
    background: #2980b9;
  }
  
  .btn-delete {
    background: #e74c3c;
    color: white;
  }
  
  .btn-delete:hover {
    background: #c0392b;
  }
  
  .form-group {
    margin-bottom: 15px;
  }
  
  .form-group label {
    display: block;
    margin-bottom: 5px;
    color: #333;
    font-weight: bold;
  }
  
  .form-group input,
  .form-group textarea,
  .form-group select {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 14px;
  }
  
  .form-group textarea {
    resize: vertical;
    min-height: 100px;
  }
  
  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
  }
  
  .success {
    background: #d4edda;
    color: #155724;
    padding: 12px;
    border-radius: 5px;
    margin-bottom: 20px;
    border: 1px solid #c3e6cb;
  }
  
  .error {
    background: #f8d7da;
    color: #721c24;
    padding: 12px;
    border-radius: 5px;
    margin-bottom: 20px;
    border: 1px solid #f5c6cb;
  }
  
  .empty {
    text-align: center;
    color: #666;
    padding: 40px;
    font-size: 16px;
  }

  .upload-box {
    border: 2px dashed #667eea;
    border-radius: 12px;
    padding: 14px;
    background: #f8faff;
  }

  .upload-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    align-items: center;
    margin-bottom: 10px;
  }

  .upload-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 10px 14px;
    background: #667eea;
    color: white;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    border: none;
  }

  .upload-button:hover {
    background: #5568d8;
  }

  .upload-meta {
    color: #666;
    font-size: 13px;
  }

  .preview-grid {
    margin-top: 15px;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
    gap: 12px;
  }

  .preview-card {
    background: white;
    border: 1px solid #dfe6ff;
    border-radius: 12px;
    padding: 8px;
    box-shadow: 0 4px 14px rgba(102, 126, 234, 0.08);
  }

  .preview-card img {
    width: 100%;
    height: 110px;
    object-fit: cover;
    border-radius: 8px;
    border: 1px solid #d7ddf8;
    display: block;
  }

  .preview-card .name {
    font-size: 12px;
    font-weight: 600;
    color: #333;
    margin-top: 8px;
    word-break: break-word;
  }

  .preview-card .meta {
    font-size: 11px;
    color: #777;
    margin-top: 4px;
  }

  .preview-remove {
    margin-top: 8px;
    width: 100%;
    border: none;
    background: #ffe5e5;
    color: #c0392b;
    border-radius: 8px;
    padding: 7px 10px;
    cursor: pointer;
    font-weight: 600;
    font-size: 12px;
  }

  .preview-remove:hover {
    background: #ffd1d1;
  }

  .rich-editor-shell {
    border: 1px solid #d8def3;
    border-radius: 12px;
    overflow: hidden;
    background: #fff;
    box-shadow: 0 3px 12px rgba(0, 0, 0, 0.04);
  }

  .rich-toolbar {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    padding: 12px;
    background: linear-gradient(180deg, #f8faff 0%, #eef2ff 100%);
    border-bottom: 1px solid #dfe6ff;
  }

  .rich-toolbar button {
    border: 1px solid #ccd6ff;
    background: white;
    color: #334;
    min-width: 38px;
    height: 38px;
    padding: 0 12px;
    border-radius: 10px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 700;
    transition: all 0.2s ease;
  }

  .rich-toolbar button:hover {
    border-color: #667eea;
    color: #667eea;
    transform: translateY(-1px);
  }

  .rich-toolbar button.is-text {
    min-width: auto;
    font-size: 13px;
    font-weight: 600;
  }

  .rich-editor {
    min-height: 220px;
    padding: 16px;
    outline: none;
    line-height: 1.6;
    color: #222;
  }

  .rich-editor:empty:before {
    content: attr(data-placeholder);
    color: #999;
  }

  .rich-help {
    padding: 10px 14px 14px;
    color: #666;
    font-size: 12px;
    border-top: 1px solid #f0f2f8;
    background: #fff;
  }`;


@Controller('Admin')
export class AdminController {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Admin) private adminRepo: Repository<Admin>,
    @InjectRepository(Product) private productRepo: Repository<Product>,
    @InjectRepository(Kategori) private kategoriRepo: Repository<Kategori>,
    @InjectRepository(AltKategori)
    private altKategoriRepo: Repository<AltKategori>,
    private productService: ProductService,
  ) {}

  @Get()
  getLoginPage() {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Admin Giriş</title>
        <style>${CSS_STYLES}</style>
      </head>
      <body>
        <div class="login-container">
          <h2>🔐 Admin Paneli</h2>
          <form action="/Admin/login" method="POST">
            <div class="form-group">
              <input name="kullanici_adi" placeholder="Kullanıcı Adı" required>
            </div>
            <div class="form-group">
              <input name="sifre" type="password" placeholder="Şifre" required>
            </div>
            <button type="submit">Giriş Yap</button>
          </form>
        </div>
      </body>
      </html>
    `;
  }

  @Post('login')
  async login(@Body() body: any, @Res() res: any) {
    const admin = await this.adminRepo.findOne({
      where: { kullanici_adi: body.kullanici_adi, sifre: body.sifre },
    });

    if (!admin) {
      return res.send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Giriş Hatası</title>
          <style>${CSS_STYLES}</style>
        </head>
        <body>
          <div class="container">
            <div class="error" style="max-width: 500px; margin: 50px auto;">
              ❌ Hatalı kullanıcı adı veya şifre!
              <p style="margin-top: 10px;"><a href="/Admin">Tekrar Dene</a></p>
            </div>
          </div>
        </body>
        </html>
      `);
    }

    return this.getDashboard(res);
  }

  private async getDashboard(res: any) {
    const allUsers = await this.userRepo.find();
    const products = await this.productService.getAllForAdmin();
    const stats = await this.productService.getStatistics();
    const kategoriler = await this.kategoriRepo.find({
      where: { aktif_mi: true },
      relations: ['alt_kategoriler'],
    });

    let usersTable = '';
    if (allUsers.length === 0) {
      usersTable = '<p class="empty">✅ Kayıtlı kullanıcı yok</p>';
    } else {
      usersTable = `
        <table>
          <thead>
            <tr>
              <th>Ad</th>
              <th>Soyad</th>
              <th>E-mail</th>
              <th>Telefon</th>
              <th>Kayıt Tarihi</th>
            </tr>
          </thead>
          <tbody>
            ${allUsers
              .map(
                (u: any) => `
              <tr>
                <td>${u.ad || '-'}</td>
                <td>${u.soyad || '-'}</td>
                <td>${u.email || '-'}</td>
                <td>${u.telefon || '-'}</td>
                <td>${new Date(u.kayit_tarihi).toLocaleDateString('tr-TR')}</td>
              </tr>
            `,
              )
              .join('')}
          </tbody>
        </table>
      `;
    }

    let productsTable = '';
    if (products.length === 0) {
      productsTable = '<p class="empty">📦 Henüz ürün eklenmedi</p>';
    } else {
      productsTable = `
        <table>
          <thead>
            <tr>
              <th>Ürün Adı</th>
              <th>Açıklama</th>
              <th>Fiyat</th>
              <th>Stok</th>
              <th>İşlem</th>
            </tr>
          </thead>
          <tbody>
            ${products
              .map(
                (p: any) => `
              <tr>
                <td>${p.urun_adi || '-'}</td>
                <td>${p.aciklama ? p.aciklama.substring(0, 50) : '-'}</td>
                <td>${parseFloat(p.fiyat || '0').toFixed(2)} ₺</td>
                <td>${p.stok_adedi || 0}</td>
                <td>
                  <a href="/Admin/edit-product/${p.id}" class="btn btn-edit">Düzenle</a>
                  <a href="/Admin/delete-product/${p.id}" class="btn btn-delete" onclick="return confirm('Silmek istediğinize emin misiniz?')">Sil</a>
                </td>
              </tr>
            `,
              )
              .join('')}
          </tbody>
        </table>
      `;
    }

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Admin Dashboard</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>${CSS_STYLES}</style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📊 Admin Dashboard</h1>
            <a href="/Admin" class="logout">Çıkış Yap</a>
          </div>
          
          <div class="dashboard">
            <div class="stat-card">
              <h3>${stats.totalProducts}</h3>
              <p>Toplam Ürün</p>
            </div>
            <div class="stat-card">
              <h3>${stats.totalValue.toFixed(0).replace(/\\B(?=(\\d{3})+(?!\\d))/g, ',')}</h3>
              <p>Toplam Değer (₺)</p>
            </div>
            <div class="stat-card">
              <h3>${stats.lowStockProducts}</h3>
              <p>Düşük Stok (&lt;10)</p>
            </div>
            <div class="stat-card">
              <h3>${allUsers.length}</h3>
              <p>Toplam Müşteri</p>
            </div>
          </div>
          
          <div class="tabs">
            <button class="tab-btn active" onclick="switchTab('users')">👥 Müşterileri Görüntüle</button>
            <button class="tab-btn" onclick="switchTab('products')">📦 Ürünleri Yönet</button>
            <button class="tab-btn" onclick="switchTab('add-product')">➕ Yeni Ürün Ekle</button>
            <button class="tab-btn" onclick="switchTab('orders')">📋 Sipariş Takibi</button>
            <button class="tab-btn" onclick="switchTab('stock')">📊 Stok Takibi</button>
            <button class="tab-btn" onclick="switchTab('statistics')">📈 İstatistik</button>
          </div>
          
          <div id="users" class="tab-content active">
            <h2>Kayıtlı Müşteriler</h2>
            ${usersTable}
          </div>
          
          <div id="products" class="tab-content">
            <h2>Ürün Yönetimi</h2>
            ${productsTable}
          </div>
          
          <div id="add-product" class="tab-content">
            <h2>Yeni Ürün Ekle</h2>
            <form action="/Admin/create-product" method="POST" enctype="multipart/form-data">
              <div class="form-row">
                <div class="form-group">
                  <label>Kategori *</label>
                  <select name="ana_kategori_id" id="kategoriler" required onchange="updateAltKategoriler()">
                    <option value="">-- Kategori Seçin --</option>
                    ${kategoriler
                      .map((k: any) => {
                        const altKatStr = k.alt_kategoriler
                          ? JSON.stringify(k.alt_kategoriler)
                              .replace(/"/g, '&quot;')
                              .replace(/'/g, '&#39;')
                          : '[]';
                        return `<option value="${k.id}" data-alt-kategoriler='${altKatStr}'>${k.kategori_adi}</option>`;
                      })
                      .join('')}
                  </select>
                </div>
                <div class="form-group">
                  <label>Alt Kategori *</label>
                  <select name="alt_kategori_id" id="altKategoriler" required>
                    <option value="">-- Alt Kategori Seçin --</option>
                  </select>
                </div>
              </div>
              <div class="form-group">
                <label>Ürün Adı *</label>
                <input name="urun_adi" placeholder="Ürün Adı" required>
              </div>
              <div class="form-group">
                <label>Açıklama</label>
                <div class="rich-editor-shell">
                  <div class="rich-toolbar">
                    <button type="button" onclick="formatEditor('add-description-editor','bold')"><strong>B</strong></button>
                    <button type="button" onclick="formatEditor('add-description-editor','italic')"><em>I</em></button>
                    <button type="button" onclick="formatEditor('add-description-editor','underline')"><u>U</u></button>
                    <button type="button" class="is-text" onclick="formatEditor('add-description-editor','insertUnorderedList')">• Liste</button>
                    <button type="button" class="is-text" onclick="formatEditor('add-description-editor','insertOrderedList')">1. Liste</button>
                    <button type="button" class="is-text" onclick="addLink('add-description-editor')">🔗 Link</button>
                    <button type="button" class="is-text" onclick="clearEditor('add-description-editor')">Temizle</button>
                  </div>
                  <div id="add-description-editor" class="rich-editor" contenteditable="true" data-placeholder="Ürün açıklamasını buraya yaz..."></div>
                  <div class="rich-help">Kalın, italik, altı çizili, liste ve link ekleyebilirsin. Yazı alanı altta sabit durur.</div>
                </div>
                <textarea name="aciklama" id="add-description-input" hidden></textarea>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>Fiyat (₺) *</label>
                  <input name="fiyat" type="number" step="0.01" placeholder="0.00" required>
                </div>
                <div class="form-group">
                  <label>Stok Miktarı *</label>
                  <input name="stok_adedi" type="number" placeholder="0" required>
                </div>
              </div>
              <div class="form-group">
                <label>Ürün Görselleri</label>
                <div class="upload-box">
                  <div class="upload-actions">
                    <label class="upload-button" for="images">+ Resim Seç</label>
                    <span class="upload-meta">Aynı ürüne yeni seçim yaptığında eski seçtiklerin silinmez, üstüne eklenir.</span>
                  </div>
                  <input type="file" id="images" name="images" multiple accept="image/*" style="display:none;">
                  <small style="color: #666; display: block; margin-top: 5px;">💡 Birden fazla görsel seçebilirsiniz (JPG, PNG, WebP, vb.)</small>
                  <div id="image-preview" class="preview-grid"></div>
                </div>
              </div>
              <button type="submit" class="btn" style="background: #27ae60; color: white; padding: 12px 20px; width: 100%;">✓ Ürünü Ekle</button>
            </form>
          </div>
          
          <div id="orders" class="tab-content">
            <h2>📋 Sipariş Takibi</h2>
            <div id="main-content"></div>
          </div>
          
          <div id="stock" class="tab-content">
            <h2>📊 Stok Takibi</h2>
            <p class="empty">🚀 Bu özellik yakında aktif olacaktır.</p>
          </div>
          
          <div id="statistics" class="tab-content">
            <h2>📈 İstatistik</h2>
            <p class="empty">🚀 Bu özellik yakında aktif olacaktır.</p>
          </div>
        </div>
        
        <script>
          function switchTab(tabName) {
            document.querySelectorAll('.tab-content').forEach(tab => {
              tab.classList.remove('active');
            });
            document.querySelectorAll('.tab-btn').forEach(btn => {
              btn.classList.remove('active');
            });
            document.getElementById(tabName).classList.add('active');
            event.target.classList.add('active');
            if (tabName === 'orders') {
              showSiparisler();
            }
          }

          function syncEditor(editorId, inputId) {
            const editor = document.getElementById(editorId);
            const input = document.getElementById(inputId);
            if (editor && input) {
              input.value = editor.innerHTML.trim();
            }
          }

          function formatEditor(editorId, command) {
            const editor = document.getElementById(editorId);
            if (!editor) return;
            editor.focus();
            document.execCommand(command, false, null);
          }

          function addLink(editorId) {
            const editor = document.getElementById(editorId);
            if (!editor) return;
            const url = prompt('Eklemek istediğin linki yaz');
            if (!url) return;
            editor.focus();
            document.execCommand('createLink', false, url);
          }

          function clearEditor(editorId) {
            const editor = document.getElementById(editorId);
            if (!editor) return;
            editor.innerHTML = '';
          }

          function bindRichEditor(formSelector, editorId, inputId) {
            const form = document.querySelector(formSelector);
            const editor = document.getElementById(editorId);
            const input = document.getElementById(inputId);
            if (!form || !editor || !input) return;
            editor.addEventListener('input', function() {
              syncEditor(editorId, inputId);
            });
            form.addEventListener('submit', function() {
              syncEditor(editorId, inputId);
            });
          }
          
          


          function bindMultiImagePicker(inputId, previewId) {
            const input = document.getElementById(inputId);
            const previewDiv = document.getElementById(previewId);
            if (!input || !previewDiv) return;
            const selectedFiles = [];

            function syncInputFiles() {
              const dataTransfer = new DataTransfer();
              selectedFiles.forEach(file => dataTransfer.items.add(file));
              input.files = dataTransfer.files;
            }

            function renderPreviews() {
              previewDiv.innerHTML = '';
              selectedFiles.forEach((file, index) => {
                const reader = new FileReader();
                reader.onload = function(e) {
                  const card = document.createElement('div');
                  card.className = 'preview-card';

                  const img = document.createElement('img');
                  img.src = e.target.result;

                  const name = document.createElement('div');
                  name.className = 'name';
                  name.textContent = file.name;

                  const meta = document.createElement('div');
                  meta.className = 'meta';
                  meta.textContent = 'Klasör seçimi piksel boyutuna göre otomatik';

                  const removeButton = document.createElement('button');
                  removeButton.type = 'button';
                  removeButton.className = 'preview-remove';
                  removeButton.textContent = 'Kaldır';
                  removeButton.addEventListener('click', function() {
                    selectedFiles.splice(index, 1);
                    syncInputFiles();
                    renderPreviews();
                  });

                  card.appendChild(img);
                  card.appendChild(name);
                  card.appendChild(meta);
                  card.appendChild(removeButton);
                  previewDiv.appendChild(card);
                };
                reader.readAsDataURL(file);
              });
            }

            input.addEventListener('change', function(event) {
              const newFiles = Array.from(event.target.files || []);
              newFiles.forEach(file => {
                const exists = selectedFiles.some(existing =>
                  existing.name === file.name &&
                  existing.size === file.size &&
                  existing.lastModified === file.lastModified
                );
                if (!exists) {
                  selectedFiles.push(file);
                }
              });
              syncInputFiles();
              renderPreviews();
            });
          }

          function updateAltKategoriler() {
            const kategoriId = document.getElementById('kategoriler')?.value;
            const altKategorilerSelect = document.getElementById('altKategoriler');
            if (!altKategorilerSelect) return;

            altKategorilerSelect.innerHTML = '<option value="">-- Alt Kategori Seçin --</option>';

            if (kategoriId) {
              const options = document.querySelectorAll('#kategoriler option');
              options.forEach(opt => {
                if (opt.value === kategoriId) {
                  const altKats = opt.getAttribute('data-alt-kategoriler');
                  if (altKats) {
                    const alts = JSON.parse(altKats);
                    alts.forEach(alt => {
                      const option = document.createElement('option');
                      option.value = alt.id;
                      option.textContent = alt.alt_kategori_adi;
                      altKategorilerSelect.appendChild(option);
                    });
                  }
                }
              });
            }
          }

          

          bindRichEditor('form[action="/Admin/create-product"]', 'add-description-editor', 'add-description-input');
          bindMultiImagePicker('images', 'image-preview');
          async function showSiparisler() {
            const content = document.getElementById('main-content');
            content.innerHTML = '<div class="card"><h2 style="margin-bottom:20px;"><div style="overflow-x:auto;"><table style="width:100%; border-collapse: collapse;"><thead><tr style="background: #f8f9fa;"><th style="padding:12px; border:1px solid #ddd;">No</th><th style="padding:12px; border:1px solid #ddd;">Müşteri / Misafir</th><th style="padding:12px; border:1px solid #ddd;">Tutar</th><th style="padding:12px; border:1px solid #ddd;">Durum</th></tr></thead><tbody id="siparis-list-body"><tr><td colspan="4" style="text-align:center; padding:20px;">Yükleniyor...</td></tr></tbody></table></div></div>';
            try {
              const res = await fetch('/siparis/liste');
              if (!res.ok) throw new Error('Sipariş verisi çekilemedi');
              const data = await res.json();
              const tbody = document.getElementById('siparis-list-body');
              if (data.length === 0) {
                tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding:20px;">Henüz sipariş yok.</td></tr>';
                return;
              }
              tbody.innerHTML = data.map(s => {
                let isim = "Kayıtlı Üye";
                if (s.notlar && s.notlar.startsWith('Misafir:')) {
                  const parts = s.notlar.split(' - ');
                  if (parts.length >= 1) {
                    isim = parts[0].replace('Misafir: ', '');
                  }
                } else if (s.ad && s.soyad) {
                  isim = s.ad + " " + s.soyad;
                }
                return '<tr>' +
                  '<td style="padding:12px; border:1px solid #ddd;">#' + s.id + '</td>' +
                  '<td style="padding:12px; border:1px solid #ddd;">' + isim + '</td>' +
                  '<td style="padding:12px; border:1px solid #ddd;">' + s.toplam_tutar + ' TL</td>' +
                  '<td style="padding:12px; border:1px solid #ddd;">' +
                    '<select id="status-' + s.id + '" style="padding:5px; border-radius:4px; border:1px solid #ccc;">' +
                      '<option value="Beklemede" ' + (s.durum === 'Beklemede' ? 'selected' : '') + '>Beklemede</option>' +
                      '<option value="Hazırlanıyor" ' + (s.durum === 'Hazırlanıyor' ? 'selected' : '') + '>Hazırlanıyor</option>' +
                      '<option value="Kargoya Verildi" ' + (s.durum === 'Kargoya Verildi' ? 'selected' : '') + '>Kargoya Verildi</option>' +
                      '<option value="Tamamlandı" ' + (s.durum === 'Tamamlandı' ? 'selected' : '') + '>Tamamlandı</option>' +
                      '<option value="İptal Edildi" ' + (s.durum === 'İptal Edildi' ? 'selected' : '') + '>İptal Edildi</option>' +
                    '</select>' +
                    '<button onclick="updateOrderStatus(' + s.id + ')" style="margin-left:5px; padding:5px 10px; background:#764ba2; color:white; border:none; border-radius:4px; cursor:pointer;">Güncelle</button>' +
                  '</td>' +
                '</tr>';
              }).join('');
            } catch (err) {
              document.getElementById('siparis-list-body').innerHTML = '<tr><td colspan="4" style="text-align:center; color:red; padding:20px;">Veri çekilemedi!</td></tr>';
            }
          }

          async function updateOrderStatus(orderId) {
            const newStatus = document.getElementById('status-' + orderId).value;
            try {
              const response = await fetch('/siparis/guncelle/' + orderId, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ durum: newStatus })
              });
              if (response.ok) {
                alert('Sipariş durumu başarıyla güncellendi!');
                showSiparisler();
              } else {
                alert('Güncelleme sırasında bir hata oluştu.');
              }
            } catch (err) {
              console.error('Hata:', err);
              alert('Sunucuya bağlanılamadı.');
            }
          }
        </script>
      </body>
      </html>
    `;

    res.send(html);
  }

  @Post('create-product')
  @UseInterceptors(
    FilesInterceptor('images', 20, {
      storage: memoryStorage(),
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  async createProduct(
    @Body() body: any,
    @UploadedFiles() files: any[],
    @Res() res: any,
  ) {
    try {
      const product = await this.productService.create({
        alt_kategori_id: parseInt(body.alt_kategori_id),
        urun_adi: body.urun_adi,
        aciklama: body.aciklama || '',
        fiyat: parseFloat(body.fiyat),
        stok_adedi: parseInt(body.stok_adedi),
      });
      if (files?.length) {
        await this.productService.uploadAndCreateImages(product.id, files);
      }
      res.redirect('/Admin/dashboard');
    } catch (error) {
      res.send(
        `<p style="color: red; padding: 20px;">Ürün eklenirken hata oluştu: ${error.message}</p><a href="/Admin/dashboard">Geri Dön</a>`,
      );
    }
  }

  @Get('dashboard')
  async showDashboard(@Res() res) {
    return this.getDashboard(res);
  }

  @Get('delete-product/:id')
  async deleteProduct(@Param('id') id: string, @Res() res: any) {
    try {
      await this.productService.delete(parseInt(id));
      res.redirect('/Admin/dashboard');
    } catch {
      res.send(
        '<p class="error">Ürün silinirken hata oluştu!</p><a href="/Admin/dashboard">Geri Dön</a>',
      );
    }
  }

  @Get('edit-product/:id')
  async editProductPage(@Param('id') id: string, @Res() res: any) {
    const product = await this.productService.findById(parseInt(id));
    if (!product) {
      return res.send(
        '<p class="error">Ürün bulunamadı!</p><a href="/Admin/dashboard">Geri Dön</a>',
      );
    }

    const kategoriler = await this.kategoriRepo.find({
      where: { aktif_mi: true },
      relations: ['alt_kategoriler'],
    });

    const imagesHtml =
      product.images && product.images.length > 0
        ? `
        <div style="margin-top: 20px; border-top: 2px solid #e0e0e0; padding-top: 20px;">
          <h3>📸 Ürün Görselleri (${product.images.length})</h3>
          <div id="images-list" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 15px; margin-top: 15px;">
            ${product.images
              .map(
                (img: any) => `
              <div style="border: 1px solid #ddd; border-radius: 8px; padding: 10px; position: relative;">
                <img src="${img.gorsel_yolu}" style="width: 100%; height: 120px; object-fit: cover; border-radius: 5px; margin-bottom: 10px;">
                <div style="font-size: 12px; color: #666; margin-bottom: 8px;">
                  <strong>ID:</strong> ${img.id}<br>
                  <strong>Adı:</strong> ${(() => { const fileName = (img.gorsel_yolu || '').split('/').pop() || 'İsimsiz'; return fileName.replace(/\.[^/.]+$/, ''); })()}
                </div>
                ${img.ana_gorsel_mi ? '<span style="background: #27ae60; color: white; padding: 3px 8px; border-radius: 3px; font-size: 11px; font-weight: bold;">ANA GÖRSEL</span>' : ''}
                <div style="margin-top: 8px; display: flex; flex-direction: column; gap: 5px;">
                  <input 
                    type="text" 
                    id="name-${img.id}" 
                    value="${(() => { const fileName = (img.gorsel_yolu || '').split('/').pop() || ''; return fileName.replace(/\.[^/.]+$/, ''); })()}" 
                    placeholder="Görsel adı"
                    style="padding: 6px; font-size: 12px; border: 1px solid #ddd; border-radius: 3px;"
                  >
                  <button 
                    type="button" 
                    onclick="renameImage(${img.id})"
                    style="padding: 4px 8px; background: #3498db; color: white; border: none; border-radius: 3px; font-size: 11px; cursor: pointer;"
                  >✎ Adı Değiştir</button>
                  ${
                    !img.ana_gorsel_mi
                      ? `<button 
                    type="button" 
                    onclick="setMainImage(${img.id})"
                    style="padding: 4px 8px; background: #f39c12; color: white; border: none; border-radius: 3px; font-size: 11px; cursor: pointer;"
                  >⭐ Ana Yap</button>`
                      : ''
                  }
                  <button 
                    type="button" 
                    onclick="deleteImage(${img.id})"
                    style="padding: 4px 8px; background: #e74c3c; color: white; border: none; border-radius: 3px; font-size: 11px; cursor: pointer;"
                  >🗑 Sil</button>
                </div>
              </div>
            `,
              )
              .join('')}
          </div>
        </div>
      `
        : '<p style="color: #999; font-style: italic;">Bu ürüne henüz görsel eklenmedi</p>';

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Ürünü Düzenle</title>
        <meta charset="UTF-8">
        <style>${CSS_STYLES}</style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>Ürünü Düzenle: ${product.urun_adi}</h2>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 10px; max-width: 800px; margin: 0 auto;">
            <form action="/Admin/update-product/${product.id}" method="POST" enctype="multipart/form-data">
              <div class="form-row">
                <div class="form-group">
                  <label>Kategori *</label>
                  <select name="ana_kategori_id" id="kategoriler" required onchange="updateAltKategoriler()">
                    <option value="">-- Kategori Seçin --</option>
                    ${kategoriler
                      .map((k: any) => {
                        const altKatStr = k.alt_kategoriler
                          ? JSON.stringify(k.alt_kategoriler)
                              .replace(/"/g, '&quot;')
                              .replace(/'/g, '&#39;')
                          : '[]';
                        return `<option value="${k.id}" data-alt-kategoriler='${altKatStr}'>${k.kategori_adi}</option>`;
                      })
                      .join('')}
                  </select>
                </div>
                <div class="form-group">
                  <label>Alt Kategori *</label>
                  <select name="alt_kategori_id" id="altKategoriler" required>
                    <option value="">-- Alt Kategori Seçin --</option>
                  </select>
                </div>
              </div>
              <div class="form-group">
                <label>Ürün Adı</label>
                <input name="urun_adi" value="${product.urun_adi}" required>
              </div>
              <div class="form-group">
                <label>Açıklama</label>
                <div class="rich-editor-shell">
                  <div class="rich-toolbar">
                    <button type="button" onclick="formatEditor('edit-description-editor','bold')"><strong>B</strong></button>
                    <button type="button" onclick="formatEditor('edit-description-editor','italic')"><em>I</em></button>
                    <button type="button" onclick="formatEditor('edit-description-editor','underline')"><u>U</u></button>
                    <button type="button" class="is-text" onclick="formatEditor('edit-description-editor','insertUnorderedList')">• Liste</button>
                    <button type="button" class="is-text" onclick="formatEditor('edit-description-editor','insertOrderedList')">1. Liste</button>
                    <button type="button" class="is-text" onclick="addLink('edit-description-editor')">🔗 Link</button>
                    <button type="button" class="is-text" onclick="clearEditor('edit-description-editor')">Temizle</button>
                  </div>
                  <div id="edit-description-editor" class="rich-editor" contenteditable="true" data-placeholder="Ürün açıklamasını buraya yaz..."></div>
                  <div class="rich-help">Araç çubuğu üstte, yazı alanı altta. Düzenleme ekranında da aynı görünür.</div>
                </div>
                <textarea name="aciklama" id="edit-description-input" hidden></textarea>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>Fiyat (₺)</label>
                  <input name="fiyat" type="number" step="0.01" value="${product.fiyat}" required>
                </div>
                <div class="form-group">
                  <label>Stok</label>
                  <input name="stok_adedi" type="number" value="${product.stok_adedi}" required>
                </div>
              </div>

              <div class="form-group">
                <label>Yeni Ürün Görselleri</label>
                <div class="upload-box">
                  <div class="upload-actions">
                    <label class="upload-button" for="edit-images">+ Resim Ekle</label>
                    <span class="upload-meta">Yeni seçim yaptığında önceki seçtiklerin silinmez, üstüne eklenir.</span>
                  </div>
                  <input type="file" id="edit-images" name="images" multiple accept="image/*" style="display:none;">
                  <small style="color: #666; display: block; margin-top: 5px;">💡 Birden fazla görsel seçebilirsiniz. Her görsel piksel boyutuna göre büyük / orta / küçük klasörüne kaydedilir ve veritabanına tek yol yazılır.</small>
                  <div id="edit-image-preview" class="preview-grid"></div>
                </div>
              </div>

              ${imagesHtml}
              
              <div style="display: flex; gap: 10px; margin-top: 20px;">
                <button type="submit" class="btn" style="background: #27ae60; color: white; padding: 12px 20px; flex: 1;">✓ Kaydet</button>
                <a href="/Admin/dashboard" class="btn" style="background: #95a5a6; color: white; padding: 12px 20px; flex: 1; text-align: center; text-decoration: none;">İptal</a>
              </div>
            </form>
          </div>
        </div>
        
        <script>
          const productId = ${product.id};
          const currentAltKategoriId = ${product.alt_kategori_id || 'null'};
          const initialDescriptionHtml = ${JSON.stringify(product.aciklama || '').replace(/</g, '\\u003c')};

          function syncEditor(editorId, inputId) {
            const editor = document.getElementById(editorId);
            const input = document.getElementById(inputId);
            if (editor && input) {
              input.value = editor.innerHTML.trim();
            }
          }

          function formatEditor(editorId, command) {
            const editor = document.getElementById(editorId);
            if (!editor) return;
            editor.focus();
            document.execCommand(command, false, null);
          }

          function addLink(editorId) {
            const editor = document.getElementById(editorId);
            if (!editor) return;
            const url = prompt('Eklemek istediğin linki yaz');
            if (!url) return;
            editor.focus();
            document.execCommand('createLink', false, url);
          }

          function clearEditor(editorId) {
            const editor = document.getElementById(editorId);
            if (!editor) return;
            editor.innerHTML = '';
          }

          function bindRichEditor(formSelector, editorId, inputId, initialHtml) {
            const form = document.querySelector(formSelector);
            const editor = document.getElementById(editorId);
            const input = document.getElementById(inputId);
            if (!form || !editor || !input) return;
            editor.innerHTML = initialHtml || '';
            input.value = initialHtml || '';
            editor.addEventListener('input', function() {
              syncEditor(editorId, inputId);
            });
            form.addEventListener('submit', function() {
              syncEditor(editorId, inputId);
            });
          }

          function updateAltKategoriler() {
            const kategoriId = document.getElementById('kategoriler')?.value;
            const altKategorilerSelect = document.getElementById('altKategoriler');
            if (!altKategorilerSelect) return;

            altKategorilerSelect.innerHTML = '<option value="">-- Alt Kategori Seçin --</option>';

            if (kategoriId) {
              const options = document.querySelectorAll('#kategoriler option');
              options.forEach(opt => {
                if (opt.value === kategoriId) {
                  const altKats = opt.getAttribute('data-alt-kategoriler');
                  if (altKats) {
                    const alts = JSON.parse(altKats);
                    alts.forEach(alt => {
                      const option = document.createElement('option');
                      option.value = alt.id;
                      option.textContent = alt.alt_kategori_adi;
                      if (alt.id === currentAltKategoriId) {
                        option.selected = true;
                      }
                      altKategorilerSelect.appendChild(option);
                    });
                  }
                }
              });
            }
          }

          async function renameImage(imageId) {
            const newName = document.getElementById('name-' + imageId).value;
            if (!newName.trim()) {
              alert('Görsel adı boş olamaz');
              return;
            }
            try {
              const response = await fetch('/products/images/' + imageId + '/rename', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ yeni_ad: newName })
              });
              if (response.ok) {
                alert('Görsel adı başarıyla değiştirildi');
                location.reload();
              } else {
                alert('Hata: ' + (await response.text()));
              }
            } catch (error) {
              alert('İşlem başarısız: ' + error.message);
            }
          }

          async function deleteImage(imageId) {
            if (!confirm('Görseli silmek istediğinize emin misiniz?')) return;
            try {
              const response = await fetch('/products/images/' + imageId, {
                method: 'DELETE'
              });
              if (response.ok) {
                alert('Görsel başarıyla silindi');
                location.reload();
              } else {
                alert('Hata: ' + (await response.text()));
              }
            } catch (error) {
              alert('İşlem başarısız: ' + error.message);
            }
          }

          async function setMainImage(imageId) {
            try {
              const response = await fetch('/products/images/' + imageId + '/set-main', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
              });
              if (response.ok) {
                alert('Görsel ana görsel olarak ayarlandı');
                location.reload();
              } else {
                alert('Hata: ' + (await response.text()));
              }
            } catch (error) {
              alert('İşlem başarısız: ' + error.message);
            }
          }

          function bindMultiImagePicker(inputId, previewId) {
            const input = document.getElementById(inputId);
            const previewDiv = document.getElementById(previewId);
            if (!input || !previewDiv) return;
            const selectedFiles = [];

            function syncInputFiles() {
              const dataTransfer = new DataTransfer();
              selectedFiles.forEach(file => dataTransfer.items.add(file));
              input.files = dataTransfer.files;
            }

            function renderPreviews() {
              previewDiv.innerHTML = '';
              selectedFiles.forEach((file, index) => {
                const reader = new FileReader();
                reader.onload = function(e) {
                  const card = document.createElement('div');
                  card.className = 'preview-card';

                  const img = document.createElement('img');
                  img.src = e.target.result;

                  const name = document.createElement('div');
                  name.className = 'name';
                  name.textContent = file.name;

                  const meta = document.createElement('div');
                  meta.className = 'meta';
                  meta.textContent = 'Klasör seçimi piksel boyutuna göre otomatik';

                  const removeButton = document.createElement('button');
                  removeButton.type = 'button';
                  removeButton.className = 'preview-remove';
                  removeButton.textContent = 'Kaldır';
                  removeButton.addEventListener('click', function() {
                    selectedFiles.splice(index, 1);
                    syncInputFiles();
                    renderPreviews();
                  });

                  card.appendChild(img);
                  card.appendChild(name);
                  card.appendChild(meta);
                  card.appendChild(removeButton);
                  previewDiv.appendChild(card);
                };
                reader.readAsDataURL(file);
              });
            }

            input.addEventListener('change', function(event) {
              const newFiles = Array.from(event.target.files || []);
              newFiles.forEach(file => {
                const exists = selectedFiles.some(existing =>
                  existing.name === file.name &&
                  existing.size === file.size &&
                  existing.lastModified === file.lastModified
                );
                if (!exists) {
                  selectedFiles.push(file);
                }
              });
              syncInputFiles();
              renderPreviews();
            });
          }

          window.addEventListener('DOMContentLoaded', function() {
            bindRichEditor('form[action="/Admin/update-product/${product.id}"]', 'edit-description-editor', 'edit-description-input', initialDescriptionHtml);
            bindMultiImagePicker('edit-images', 'edit-image-preview');

            if (currentAltKategoriId) {
              const options = document.querySelectorAll('#kategoriler option');
              let found = false;
              options.forEach(opt => {
                const altKats = opt.getAttribute('data-alt-kategoriler');
                if (altKats) {
                  const alts = JSON.parse(altKats);
                  if (alts.some(alt => alt.id === currentAltKategoriId)) {
                    document.getElementById('kategoriler').value = opt.value;
                    found = true;
                  }
                }
              });
              if (found) {
                updateAltKategoriler();
              }
            }
          });
        </script>
      </body>
      </html>
    `;
    res.send(html);
  }

  @Post('update-product/:id')
  @UseInterceptors(
    FilesInterceptor('images', 20, {
      storage: memoryStorage(),
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  async updateProduct(
    @Param('id') id: string,
    @Body() body: any,
    @UploadedFiles() files: any[],
    @Res() res: any,
  ) {
    try {
      const productId = parseInt(id);
      await this.productService.update(productId, {
        alt_kategori_id: parseInt(body.alt_kategori_id),
        urun_adi: body.urun_adi,
        aciklama: body.aciklama,
        fiyat: parseFloat(body.fiyat),
        stok_adedi: parseInt(body.stok_adedi),
      });
      if (files?.length) {
        await this.productService.uploadAndCreateImages(productId, files);
      }
      res.redirect('/Admin/dashboard');
    } catch (error) {
      res.send(
        `<p class="error">Ürün güncellenirken hata oluştu: ${error.message}</p><a href="/Admin/dashboard">Geri Dön</a>`,
      );
    }
  }
}
