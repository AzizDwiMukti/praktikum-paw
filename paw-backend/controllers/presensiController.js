const { Presensi } = require("../models");
const { Op } = require("sequelize");

// POST /api/presensi/check-in
exports.checkIn = async (req, res) => {
  try {
    const userId = req.user.id; // ✅ WAJIB: dari JWT
    const now = new Date();

    // Cegah check-in ganda (masih ada sesi aktif checkOut null)
    const existing = await Presensi.findOne({
      where: { userId, checkOut: null },
    });

    if (existing) {
      return res.status(400).json({ message: "Anda sudah check-in dan belum check-out." });
    }

    const record = await Presensi.create({
      userId,
      checkIn: now,
      checkOut: null,
    });

    return res.status(201).json({
      message: "Check-in berhasil",
      data: record,
    });
  } catch (err) {
    return res.status(500).json({ message: "Gagal check-in", error: err.message });
  }
};

// POST /api/presensi/check-out
exports.checkOut = async (req, res) => {
  try {
    const userId = req.user.id; // ✅ WAJIB: dari JWT
    const now = new Date();

    const record = await Presensi.findOne({
      where: { userId, checkOut: null },
      order: [["checkIn", "DESC"]],
    });

    if (!record) {
      return res.status(404).json({ message: "Tidak ada presensi aktif untuk di-check-out." });
    }

    record.checkOut = now;
    await record.save();

    return res.json({
      message: "Check-out berhasil",
      data: record,
    });
  } catch (err) {
    return res.status(500).json({ message: "Gagal check-out", error: err.message });
  }
};
