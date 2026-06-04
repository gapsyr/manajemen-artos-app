const {
  tambahKeSpreadsheet
} = require("../services/googleSheetsService");

const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../../data/transaksi.json");

function bacaData() {
  const data = fs.readFileSync(filePath, "utf8");
  return JSON.parse(data);
}

function simpanData(data) {
  fs.writeFileSync(
    filePath,
    JSON.stringify(data, null, 2)
  );
}

exports.getTransaksi = (req, res) => {
  const transaksi = bacaData();
  res.json(transaksi);
};

exports.tambahTransaksi = async (req, res) => {
  const transaksi = bacaData();

  const { kategori, nominal, tipe } = req.body;

if (!kategori || kategori.trim() === "") {
  return res.status(400).json({
    error: "Kategori wajib diisi"
  });
}

if (isNaN(nominal) || Number(nominal) <= 0) {
  return res.status(400).json({
    error: "Nominal harus berupa angka lebih dari 0"
  });
}

if (!["masuk", "keluar"].includes(tipe)) {
  return res.status(400).json({
    error: "Tipe hanya boleh masuk atau keluar"
  });
}

  const dataBaru = {
    id: Date.now(),
    tanggal: new Date(),
    kategori,
    nominal,
    tipe
  };

  transaksi.push(dataBaru);

  simpanData(transaksi);

  await tambahKeSpreadsheet(dataBaru);

  res.status(201).json({
    message: "Transaksi berhasil ditambahkan",
    data: dataBaru
  });
};

exports.getSaldo = (req, res) => {
  const transaksi = bacaData();

  let saldo = 0;

  transaksi.forEach(item => {
    if (item.tipe === "masuk") {
      saldo += item.nominal;
    } else {
      saldo -= item.nominal;
    }
  });

  res.json({ saldo });
};