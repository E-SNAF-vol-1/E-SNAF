const express = require("express");
const cors = require("cors");
const session = require("express-session");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const addressRoutes = require("./routes/addressRoutes");
const app = express();
const weatherRoutes = require("./routes/weatherRoutes");
console.log("weatherRoutes yüklendi");
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));

app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24
  }
}));

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



const pool = require("./db");

pool.connect()
  .then(client => {
    console.log("Supabase bağlantısı başarılı");
    client.release();
  })
  .catch(err => {
    console.error("Supabase bağlantı hatası:", err.message);
  });