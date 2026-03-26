
CREATE TABLE public.sehir (
    id SERIAL PRIMARY KEY,
    sehir_adi VARCHAR(100) NOT NULL
);

CREATE TABLE public.kategori (
    id SERIAL PRIMARY KEY,
    kategori_adi VARCHAR(100) NOT NULL
);


CREATE TABLE public.alt_kategori (
    id SERIAL PRIMARY KEY,
    ana_kategori_id INTEGER NOT NULL REFERENCES public.kategori(id) ON DELETE CASCADE,
    alt_kategori_adi VARCHAR(100) NOT NULL
);

CREATE TABLE public.yonetim_hesaplari (
    id SERIAL PRIMARY KEY,
    kullanici_adi VARCHAR(50) UNIQUE NOT NULL,
    sifre TEXT NOT NULL,
    rol VARCHAR(20) DEFAULT 'editor'
);


CREATE TABLE public.musteri (
    id SERIAL PRIMARY KEY,
    ad VARCHAR(50),
    soyad VARCHAR(50),
    email VARCHAR(100) UNIQUE NOT NULL,
    sifre TEXT NOT NULL,
    telefon VARCHAR(20),
    kayit_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.adres (
    id SERIAL PRIMARY KEY,
    musteri_id INTEGER REFERENCES public.musteri(id) ON DELETE CASCADE,
    sehir_id INTEGER REFERENCES public.sehir(id),
    adres_basligi VARCHAR(50),
    tam_adres TEXT NOT NULL
);


CREATE TABLE public.urun (
    id SERIAL PRIMARY KEY,
    alt_kategori_id INTEGER REFERENCES public.alt_kategori(id) ON DELETE SET NULL,
    urun_adi VARCHAR(200) NOT NULL,
    aciklama TEXT,
    fiyat NUMERIC(10,2) NOT NULL CHECK (fiyat >= 0),
    stok_adedi INTEGER DEFAULT 0 CHECK (stok_adedi >= 0)
);

CREATE TABLE public.urun_gorsel (
    id SERIAL PRIMARY KEY,
    urun_id INTEGER REFERENCES public.urun(id) ON DELETE CASCADE,
    gorsel_yolu TEXT NOT NULL,
    ana_gorsel_mi BOOLEAN DEFAULT false
);


CREATE TABLE public.yorum (
    id SERIAL PRIMARY KEY,
    urun_id INTEGER REFERENCES public.urun(id) ON DELETE CASCADE,
    musteri_id INTEGER REFERENCES public.musteri(id) ON DELETE CASCADE,
    puan INTEGER CHECK (puan >= 1 AND puan <= 5),
    icerik TEXT,
    tarih TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.sepet_detay (
    id SERIAL PRIMARY KEY,
    musteri_id INTEGER REFERENCES public.musteri(id) ON DELETE CASCADE,
    urun_id INTEGER REFERENCES public.urun(id) ON DELETE CASCADE,
    adet INTEGER DEFAULT 1 CHECK (adet > 0)
);

CREATE TABLE public.siparis (
    id SERIAL PRIMARY KEY,
    musteri_id INTEGER REFERENCES public.musteri(id),
    adres_id INTEGER REFERENCES public.adres(id),
    toplam_tutar NUMERIC(10,2) CHECK (toplam_tutar >= 0),
    siparis_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    durum VARCHAR(50) DEFAULT 'Hazırlanıyor'
);

CREATE TABLE public.siparis_detay (
    id SERIAL PRIMARY KEY,
    siparis_id INTEGER REFERENCES public.siparis(id) ON DELETE CASCADE,
    urun_id INTEGER REFERENCES public.urun(id),
    adet INTEGER NOT NULL CHECK (adet > 0),
    birim_fiyat NUMERIC(10,2) NOT NULL CHECK (birim_fiyat >= 0)
);
