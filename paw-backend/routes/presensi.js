const express = require("express");
const { Presensi } = require("../models");
const { auth } = require("../middleware/auth");

const router = express.Router();

router.post("/check-in", auth, async (req, res) => {
  const { id: userId, nama } = req.user;

  const existing = await Presensi.findOne({ where: { userId, checkOut: null } });
  if (existing) return res.status(400).json({ message: "Anda sudah check-in (belum check-out)." });

  const data = await Presensi.create({ userId, nama, checkIn: new Date(), checkOut: null });
  res.status(201).json({ message: "Check-in berhasil", data });
});

router.post("/check-out", auth, async (req, res) => {
  const { id: userId } = req.user;

  const rec = await Presensi.findOne({ where: { userId, checkOut: null } });
  if (!rec) return res.status(404).json({ message: "Tidak ada check-in aktif." });

  rec.checkOut = new Date();
  await rec.save();
  res.json({ message: "Check-out berhasil", data: rec });
});

router.get("/me", auth, async (req, res) => {
  const { id: userId } = req.user;
  const list = await Presensi.findAll({ where: { userId }, order: [["id","DESC"]] });
  res.json({ data: list });
});

module.exports = router;
