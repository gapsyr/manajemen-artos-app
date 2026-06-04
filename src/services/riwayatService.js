const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../../data/transaksi.json");

function ambilRiwayat(limit = 5) {
  if (!fs.existsSync(filePath)) return [];

  const transaksi = JSON.parse(fs.readFileSync(filePath, "utf8"));

  return transaksi.slice(-limit).reverse();
}

module.exports = {
  ambilRiwayat
};