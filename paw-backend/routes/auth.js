const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = express.Router();

// SIMPAN DI .env kalau sudah paham, untuk praktikum boleh hardcode
const JWT_SECRET = "rahasia_jwt_praktikum";

// Dummy "database"
const users = []; 
// format: { id, nama, email, passwordHash, role }

router.post("/register", async (req, res) => {
  try {
    const { nama, email, password, role } = req.body;

    if (!nama || !email || !password) {
      return res.status(400).json({ message: "Nama, email, dan password harus diisi" });
    }

    const roleFinal = role || "mahasiswa";

    const existing = users.find((u) => u.email === email);
    if (existing) {
      return res.status(409).json({ message: "Email sudah terdaftar" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = {
      id: users.length + 1,
      nama,
      email,
      passwordHash,
      role: roleFinal,
    };

    users.push(newUser);

    return res.status(201).json({
      message: "Register berhasil",
      data: { id: newUser.id, nama: newUser.nama, email: newUser.email, role: newUser.role },
    });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email dan password harus diisi" });
    }

    const user = users.find((u) => u.email === email);
    if (!user) {
      return res.status(401).json({ message: "Email atau password salah" });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return res.status(401).json({ message: "Email atau password salah" });
    }

    const token = jwt.sign(
      { id: user.id, nama: user.nama, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.json({ message: "Login berhasil", token });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
});

module.exports = router;
