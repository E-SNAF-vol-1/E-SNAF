--
-- PostgreSQL database dump
--

\restrict TswzsjlytBozv1jlXof95g477xRkTB0yQh33dUukGyDI3OyB3zymHzxxS625hh5

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: adres; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.adres (
    id integer NOT NULL,
    musteri_id integer,
    sehir_id integer,
    adres_basligi character varying(50),
    tam_adres text NOT NULL
);


ALTER TABLE public.adres OWNER TO postgres;

--
-- Name: adres_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.adres_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.adres_id_seq OWNER TO postgres;

--
-- Name: adres_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.adres_id_seq OWNED BY public.adres.id;


--
-- Name: kategori; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.kategori (
    id integer NOT NULL,
    kategori_adi character varying(100) NOT NULL,
    ust_kategori_id integer
);


ALTER TABLE public.kategori OWNER TO postgres;

--
-- Name: kategori_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.kategori_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.kategori_id_seq OWNER TO postgres;

--
-- Name: kategori_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.kategori_id_seq OWNED BY public.kategori.id;


--
-- Name: musteri; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.musteri (
    id integer NOT NULL,
    ad character varying(50),
    soyad character varying(50),
    email character varying(100) NOT NULL,
    sifre text NOT NULL,
    telefon character varying(20),
    kayit_tarihi timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.musteri OWNER TO postgres;

--
-- Name: musteri_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.musteri_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.musteri_id_seq OWNER TO postgres;

--
-- Name: musteri_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.musteri_id_seq OWNED BY public.musteri.id;


--
-- Name: sehir; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sehir (
    id integer NOT NULL,
    sehir_adi character varying(100) NOT NULL
);


ALTER TABLE public.sehir OWNER TO postgres;

--
-- Name: sehir_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sehir_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sehir_id_seq OWNER TO postgres;

--
-- Name: sehir_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sehir_id_seq OWNED BY public.sehir.id;


--
-- Name: sepet_detay; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sepet_detay (
    id integer NOT NULL,
    musteri_id integer,
    urun_id integer,
    adet integer DEFAULT 1
);


ALTER TABLE public.sepet_detay OWNER TO postgres;

--
-- Name: sepet_detay_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sepet_detay_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sepet_detay_id_seq OWNER TO postgres;

--
-- Name: sepet_detay_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sepet_detay_id_seq OWNED BY public.sepet_detay.id;


--
-- Name: siparis; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.siparis (
    id integer NOT NULL,
    musteri_id integer,
    adres_id integer,
    toplam_tutar numeric(10,2),
    siparis_tarihi timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    durum character varying(50) DEFAULT 'Hazırlanıyor'::character varying
);


ALTER TABLE public.siparis OWNER TO postgres;

--
-- Name: siparis_detay; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.siparis_detay (
    id integer NOT NULL,
    siparis_id integer,
    urun_id integer,
    adet integer NOT NULL,
    birim_fiyat numeric(10,2) NOT NULL
);


ALTER TABLE public.siparis_detay OWNER TO postgres;

--
-- Name: siparis_detay_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.siparis_detay_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.siparis_detay_id_seq OWNER TO postgres;

--
-- Name: siparis_detay_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.siparis_detay_id_seq OWNED BY public.siparis_detay.id;


--
-- Name: siparis_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.siparis_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.siparis_id_seq OWNER TO postgres;

--
-- Name: siparis_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.siparis_id_seq OWNED BY public.siparis.id;


--
-- Name: urun; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.urun (
    id integer NOT NULL,
    kategori_id integer,
    urun_adi character varying(200) NOT NULL,
    aciklama text,
    fiyat numeric(10,2) NOT NULL,
    stok_adedi integer DEFAULT 0
);


ALTER TABLE public.urun OWNER TO postgres;

--
-- Name: urun_gorsel; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.urun_gorsel (
    id integer NOT NULL,
    urun_id integer,
    gorsel_yolu text NOT NULL,
    ana_gorsel_mi boolean DEFAULT false
);


ALTER TABLE public.urun_gorsel OWNER TO postgres;

--
-- Name: urun_gorsel_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.urun_gorsel_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.urun_gorsel_id_seq OWNER TO postgres;

--
-- Name: urun_gorsel_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.urun_gorsel_id_seq OWNED BY public.urun_gorsel.id;


--
-- Name: urun_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.urun_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.urun_id_seq OWNER TO postgres;

--
-- Name: urun_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.urun_id_seq OWNED BY public.urun.id;


--
-- Name: yonetim_hesaplari; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.yonetim_hesaplari (
    id integer NOT NULL,
    kullanici_adi character varying(50) NOT NULL,
    sifre text NOT NULL,
    rol character varying(20) DEFAULT 'editor'::character varying
);


ALTER TABLE public.yonetim_hesaplari OWNER TO postgres;

--
-- Name: yonetim_hesaplari_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.yonetim_hesaplari_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.yonetim_hesaplari_id_seq OWNER TO postgres;

--
-- Name: yonetim_hesaplari_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.yonetim_hesaplari_id_seq OWNED BY public.yonetim_hesaplari.id;


--
-- Name: yorum; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.yorum (
    id integer NOT NULL,
    urun_id integer,
    musteri_id integer,
    puan integer,
    icerik text,
    tarih timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT yorum_puan_check CHECK (((puan >= 1) AND (puan <= 5)))
);


ALTER TABLE public.yorum OWNER TO postgres;

--
-- Name: yorum_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.yorum_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.yorum_id_seq OWNER TO postgres;

--
-- Name: yorum_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.yorum_id_seq OWNED BY public.yorum.id;


--
-- Name: adres id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.adres ALTER COLUMN id SET DEFAULT nextval('public.adres_id_seq'::regclass);


--
-- Name: kategori id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kategori ALTER COLUMN id SET DEFAULT nextval('public.kategori_id_seq'::regclass);


--
-- Name: musteri id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.musteri ALTER COLUMN id SET DEFAULT nextval('public.musteri_id_seq'::regclass);


--
-- Name: sehir id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sehir ALTER COLUMN id SET DEFAULT nextval('public.sehir_id_seq'::regclass);


--
-- Name: sepet_detay id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sepet_detay ALTER COLUMN id SET DEFAULT nextval('public.sepet_detay_id_seq'::regclass);


--
-- Name: siparis id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.siparis ALTER COLUMN id SET DEFAULT nextval('public.siparis_id_seq'::regclass);


--
-- Name: siparis_detay id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.siparis_detay ALTER COLUMN id SET DEFAULT nextval('public.siparis_detay_id_seq'::regclass);


--
-- Name: urun id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.urun ALTER COLUMN id SET DEFAULT nextval('public.urun_id_seq'::regclass);


--
-- Name: urun_gorsel id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.urun_gorsel ALTER COLUMN id SET DEFAULT nextval('public.urun_gorsel_id_seq'::regclass);


--
-- Name: yonetim_hesaplari id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.yonetim_hesaplari ALTER COLUMN id SET DEFAULT nextval('public.yonetim_hesaplari_id_seq'::regclass);


--
-- Name: yorum id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.yorum ALTER COLUMN id SET DEFAULT nextval('public.yorum_id_seq'::regclass);


--
-- Data for Name: adres; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.adres (id, musteri_id, sehir_id, adres_basligi, tam_adres) FROM stdin;
\.


--
-- Data for Name: kategori; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.kategori (id, kategori_adi, ust_kategori_id) FROM stdin;
\.


--
-- Data for Name: musteri; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.musteri (id, ad, soyad, email, sifre, telefon, kayit_tarihi) FROM stdin;
\.


--
-- Data for Name: sehir; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sehir (id, sehir_adi) FROM stdin;
\.


--
-- Data for Name: sepet_detay; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sepet_detay (id, musteri_id, urun_id, adet) FROM stdin;
\.


--
-- Data for Name: siparis; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.siparis (id, musteri_id, adres_id, toplam_tutar, siparis_tarihi, durum) FROM stdin;
\.


--
-- Data for Name: siparis_detay; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.siparis_detay (id, siparis_id, urun_id, adet, birim_fiyat) FROM stdin;
\.


--
-- Data for Name: urun; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.urun (id, kategori_id, urun_adi, aciklama, fiyat, stok_adedi) FROM stdin;
\.


--
-- Data for Name: urun_gorsel; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.urun_gorsel (id, urun_id, gorsel_yolu, ana_gorsel_mi) FROM stdin;
\.


--
-- Data for Name: yonetim_hesaplari; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.yonetim_hesaplari (id, kullanici_adi, sifre, rol) FROM stdin;
\.


--
-- Data for Name: yorum; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.yorum (id, urun_id, musteri_id, puan, icerik, tarih) FROM stdin;
\.


--
-- Name: adres_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.adres_id_seq', 1, false);


--
-- Name: kategori_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.kategori_id_seq', 1, false);


--
-- Name: musteri_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.musteri_id_seq', 1, false);


--
-- Name: sehir_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sehir_id_seq', 1, false);


--
-- Name: sepet_detay_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sepet_detay_id_seq', 1, false);


--
-- Name: siparis_detay_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.siparis_detay_id_seq', 1, false);


--
-- Name: siparis_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.siparis_id_seq', 1, false);


--
-- Name: urun_gorsel_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.urun_gorsel_id_seq', 1, false);


--
-- Name: urun_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.urun_id_seq', 1, false);


--
-- Name: yonetim_hesaplari_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.yonetim_hesaplari_id_seq', 1, false);


--
-- Name: yorum_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.yorum_id_seq', 1, false);


--
-- Name: adres adres_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.adres
    ADD CONSTRAINT adres_pkey PRIMARY KEY (id);


--
-- Name: kategori kategori_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kategori
    ADD CONSTRAINT kategori_pkey PRIMARY KEY (id);


--
-- Name: musteri musteri_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.musteri
    ADD CONSTRAINT musteri_email_key UNIQUE (email);


--
-- Name: musteri musteri_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.musteri
    ADD CONSTRAINT musteri_pkey PRIMARY KEY (id);


--
-- Name: sehir sehir_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sehir
    ADD CONSTRAINT sehir_pkey PRIMARY KEY (id);


--
-- Name: sepet_detay sepet_detay_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sepet_detay
    ADD CONSTRAINT sepet_detay_pkey PRIMARY KEY (id);


--
-- Name: siparis_detay siparis_detay_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.siparis_detay
    ADD CONSTRAINT siparis_detay_pkey PRIMARY KEY (id);


--
-- Name: siparis siparis_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.siparis
    ADD CONSTRAINT siparis_pkey PRIMARY KEY (id);


--
-- Name: urun_gorsel urun_gorsel_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.urun_gorsel
    ADD CONSTRAINT urun_gorsel_pkey PRIMARY KEY (id);


--
-- Name: urun urun_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.urun
    ADD CONSTRAINT urun_pkey PRIMARY KEY (id);


--
-- Name: yonetim_hesaplari yonetim_hesaplari_kullanici_adi_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.yonetim_hesaplari
    ADD CONSTRAINT yonetim_hesaplari_kullanici_adi_key UNIQUE (kullanici_adi);


--
-- Name: yonetim_hesaplari yonetim_hesaplari_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.yonetim_hesaplari
    ADD CONSTRAINT yonetim_hesaplari_pkey PRIMARY KEY (id);


--
-- Name: yorum yorum_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.yorum
    ADD CONSTRAINT yorum_pkey PRIMARY KEY (id);


--
-- Name: adres adres_musteri_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.adres
    ADD CONSTRAINT adres_musteri_id_fkey FOREIGN KEY (musteri_id) REFERENCES public.musteri(id) ON DELETE CASCADE;


--
-- Name: adres adres_sehir_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.adres
    ADD CONSTRAINT adres_sehir_id_fkey FOREIGN KEY (sehir_id) REFERENCES public.sehir(id);


--
-- Name: kategori kategori_ust_kategori_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kategori
    ADD CONSTRAINT kategori_ust_kategori_id_fkey FOREIGN KEY (ust_kategori_id) REFERENCES public.kategori(id);


--
-- Name: sepet_detay sepet_detay_musteri_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sepet_detay
    ADD CONSTRAINT sepet_detay_musteri_id_fkey FOREIGN KEY (musteri_id) REFERENCES public.musteri(id);


--
-- Name: sepet_detay sepet_detay_urun_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sepet_detay
    ADD CONSTRAINT sepet_detay_urun_id_fkey FOREIGN KEY (urun_id) REFERENCES public.urun(id);


--
-- Name: siparis siparis_adres_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.siparis
    ADD CONSTRAINT siparis_adres_id_fkey FOREIGN KEY (adres_id) REFERENCES public.adres(id);


--
-- Name: siparis_detay siparis_detay_siparis_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.siparis_detay
    ADD CONSTRAINT siparis_detay_siparis_id_fkey FOREIGN KEY (siparis_id) REFERENCES public.siparis(id) ON DELETE CASCADE;


--
-- Name: siparis_detay siparis_detay_urun_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.siparis_detay
    ADD CONSTRAINT siparis_detay_urun_id_fkey FOREIGN KEY (urun_id) REFERENCES public.urun(id);


--
-- Name: siparis siparis_musteri_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.siparis
    ADD CONSTRAINT siparis_musteri_id_fkey FOREIGN KEY (musteri_id) REFERENCES public.musteri(id);


--
-- Name: urun_gorsel urun_gorsel_urun_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.urun_gorsel
    ADD CONSTRAINT urun_gorsel_urun_id_fkey FOREIGN KEY (urun_id) REFERENCES public.urun(id) ON DELETE CASCADE;


--
-- Name: urun urun_kategori_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.urun
    ADD CONSTRAINT urun_kategori_id_fkey FOREIGN KEY (kategori_id) REFERENCES public.kategori(id);


--
-- Name: yorum yorum_musteri_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.yorum
    ADD CONSTRAINT yorum_musteri_id_fkey FOREIGN KEY (musteri_id) REFERENCES public.musteri(id);


--
-- Name: yorum yorum_urun_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.yorum
    ADD CONSTRAINT yorum_urun_id_fkey FOREIGN KEY (urun_id) REFERENCES public.urun(id);


--
-- PostgreSQL database dump complete
--

\unrestrict TswzsjlytBozv1jlXof95g477xRkTB0yQh33dUukGyDI3OyB3zymHzxxS625hh5

