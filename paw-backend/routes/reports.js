const express = require("express");
const { Presensi } = require("../models");
const { auth, adminOnly } = require("../middleware/auth");

const router = express.Router();

// contoh laporan sederhana: semua presensi
router.get("/all", auth, adminOnly, async (req, res) => {
  const data = await Presensi.findAll({ order: [["id","DESC"]] });
  res.json({ message: "Laporan presensi", data });
});

module.exports = router;
