const express = require("express");
const cors = require("cors");
const session = require("express-session");
const path = require("path");
const passport = require("passport"); 
require("dotenv").config();
require("./config/passport"); 

const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const addressRoutes = require("./routes/addressRoutes");
const weatherRoutes = require("./routes/weatherRoutes");
const pool = require("./db");

const app = express();

// --- EKLEME 1: TRUST PROXY ---
// Sunucuda (apps.srv...) çalışırken çerezlerin güvenle iletilmesi için şarttır.
app.set("trust proxy", 1); 

console.log("weatherRoutes yüklendi");

const allowedOrigins = [
  "http://localhost:4200",
  "http://localhost:5173",
  process.env.CLIENT_URL,
  "https://esnaf.apps.srv.aykutdurgut.com.tr" // Senin tam site adresin
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS hatası: " + origin));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"] // Google yönlendirmesi için metotları netleştirdik
}));

app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  proxy: true, // Sunucu ortamında session'ın kaybolmaması için eklendi
  cookie: {
    secure: process.env.NODE_ENV === "production", // Sunucuda otomatik true olur, localde false kalır
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // Google login sonrası çerezin kabul edilmesi için kritik
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24
  }
}));

app.use(passport.initialize());
app.use(passport.session());

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