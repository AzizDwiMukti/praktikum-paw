const { Presensi } = require("../models");
const { Op } = require("sequelize");

exports.getDailyReport = async (req, res) => {
  try {
    const { nama, tanggalMulai, tanggalSelesai } = req.query;

    const where = {};

    if (nama) {
      where.nama = { [Op.like]: `%${nama}%` };
    }

    // Filter rentang tanggal berdasarkan checkIn (bisa kamu ganti ke createdAt kalau dosen maunya itu)
    if (tanggalMulai && tanggalSelesai) {
      where.checkIn = {
        [Op.between]: [new Date(tanggalMulai), new Date(tanggalSelesai)],
      };
    }

    const records = await Presensi.findAll({ where });

    res.json({
      reportDate: new Date().toLocaleDateString(),
      data: records,
    });
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil laporan", error: error.message });
  }
};
