const transaksi = [];

exports.getTransaksi = (req, res) => {
  res.json(transaksi);
};

exports.tambahTransaksi = (req, res) => {
  const { kategori, nominal, tipe } = req.body;

  const dataBaru = {
    id: Date.now(),
    tanggal: new Date(),
    kategori,
    nominal,
    tipe
  };

  transaksi.push(dataBaru);

  res.status(201).json({
    message: "Transaksi berhasil ditambahkan",
    data: dataBaru
  });
};

exports.getSaldo = (req, res) => {
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