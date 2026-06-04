const express = require("express");

const router = express.Router();

const {
  getTransaksi,
  tambahTransaksi,
  getSaldo
} = require("../controllers/transaksiController");

router.get("/transaksi", getTransaksi);
router.post("/transaksi", tambahTransaksi);
router.get("/saldo", getSaldo);

module.exports = router;