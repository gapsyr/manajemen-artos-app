require("dotenv").config();

const express = require("express");

const transaksiRoutes = require("./src/routes/transaksiRoutes");

const app = express();

app.use(express.json());

app.use("/", transaksiRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server berjalan di port ${process.env.PORT}`);
});