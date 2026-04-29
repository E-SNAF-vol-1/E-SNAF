const express = require("express");
const cors = require("cors");
const session = require("express-session");
const path = require("path");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const addressRoutes = require("./routes/addressRoutes");
const weatherRoutes = require("./routes/weatherRoutes");
const pool = require("./db");

const app = express();
console.log("weatherRoutes yüklendi");

const allowedOrigins = [
  "http://localhost:4200",
  "http://localhost:5173",
  process.env.CLIENT_URL
].filter(Boolean);

// server.js içindeki cors bölümünü bu şekilde güncelleyin
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://esnaf.apps.srv.aykutdurgut.com.tr"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
}));

app.use(express.json());
app.set("trust proxy", 1);
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true, // Sadece HTTPS üzerinden gönderilir
    httpOnly: true,
    sameSite: "none", // Cross-site isteklerde çerez iletimi için gereklidir
    maxAge: 1000 * 60 * 60 * 24
  }
}));

app.use("/uploads", express.static(path.resolve(__dirname, "../../admin/uploads")));

app.get("/", (req, res) => {
  res.json({ mesaj: "E-SNAF API çalışıyor" });
});

app.use("/api/weather", weatherRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/addresses", addressRoutes);

app.listen(process.env.PORT, () => {
  console.log(`API ${process.env.PORT} portunda çalışıyor`);
});

pool.connect()
  .then(client => {
    console.log("Supabase bağlantısı başarılı");
    client.release();
  })
  .catch(err => {
    console.error("Supabase bağlantı hatası:", err.message);
  });