const express = require("express");
const cors = require("cors");

const app = express();

// WAJIB: agar React (3000) bisa akses Backend (3001)
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));

// WAJIB: agar req.body kebaca (JSON)
app.use(express.json());

// ROUTES
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

// test endpoint biar gampang cek server hidup
app.get("/", (req, res) => {
  res.json({ message: "Backend OK" });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Express server running at http://localhost:${PORT}`);
});
