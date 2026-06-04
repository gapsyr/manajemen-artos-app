const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../../data/transaksi.json");

function hitungSaldo() {
  if (!fs.existsSync(filePath)) {
    return {
      pemasukan: 0,
      pengeluaran: 0,
      saldo: 0
    };
  }

  const transaksi = JSON.parse(
    fs.readFileSync(filePath, "utf8")
  );

  let pemasukan = 0;
  let pengeluaran = 0;

  transaksi.forEach(item => {
    if (item.tipe === "masuk") {
      pemasukan += item.nominal;
    } else {
      pengeluaran += item.nominal;
    }
  });

  return {
    pemasukan,
    pengeluaran,
    saldo: pemasukan - pengeluaran
  };
}

module.exports = {
  hitungSaldo
};