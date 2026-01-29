const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const { JWT_SECRET } = require("../middleware/auth");

const router = express.Router();

router.post("/register", async (req, res) => {
  const { nama, email, password, role } = req.body;
  if (!nama || !email || !password) return res.status(400).json({ message: "Nama, email, password wajib" });

  const exist = await User.findOne({ where: { email } });
  if (exist) return res.status(409).json({ message: "Email sudah terdaftar" });

  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ nama, email, password: hash, role: role || "mahasiswa" });

  res.status(201).json({ message: "Register berhasil", data: { id: user.id, nama: user.nama, role: user.role } });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Email & password wajib" });

  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(401).json({ message: "Email atau password salah" });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ message: "Email atau password salah" });

  const token = jwt.sign({ id: user.id, nama: user.nama, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "1h" });
  res.json({ message: "Login berhasil", token, user: { id: user.id, nama: user.nama, role: user.role } });
});

module.exports = router;
