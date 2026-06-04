require("dotenv").config();

const axios = require("axios");
const pino = require("pino");
const makeWASocket = require("@whiskeysockets/baileys").default;
const {
  useMultiFileAuthState,
  DisconnectReason
} = require("@whiskeysockets/baileys");
const qrcode = require("qrcode-terminal");
const { hitungSaldo } = require("../services/saldoService");

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("auth");

  const sock = makeWASocket({
    auth: state,
    logger: pino({ level: "silent" }),
    printQRInTerminal: false
  });

  sock.ev.on("connection.update", update => {
    const { qr, connection, lastDisconnect } = update;

    if (qr) qrcode.generate(qr, { small: true });

    if (connection === "open") {
      console.log("WhatsApp terhubung");
    }

    if (connection === "close") {
      const statusCode = lastDisconnect?.error?.output?.statusCode;
      console.log("Koneksi tertutup:", statusCode);

      if (statusCode !== DisconnectReason.loggedOut) {
        setTimeout(startBot, 5000);
      } else {
        console.log("Logout. Hapus folder auth lalu scan ulang QR.");
      }
    }
  });

  sock.ev.on("messages.upsert", async ({ messages }) => {
    const msg = messages[0];

    if (!msg.message) return;

    const chatId = msg.key.remoteJid;
    if (chatId === "status@broadcast") return;
    if (msg.key.fromMe) return;

    const text =
      msg.message.conversation ||
      msg.message.extendedTextMessage?.text ||
      "";

    if (!text.startsWith("!")) return;

    if (text.trim() === "!saldo") {
      const data = hitungSaldo();

      await sock.sendMessage(chatId, {
        text: `💰 Saldo Saat Ini

Pemasukan : Rp${data.pemasukan.toLocaleString("id-ID")}
Pengeluaran : Rp${data.pengeluaran.toLocaleString("id-ID")}
Saldo : Rp${data.saldo.toLocaleString("id-ID")}`
      });

      return;
    }

    const commandText = text.slice(1).trim();
    const parts = commandText.split(" ");
    const kategori = parts[0];
    const nominal = Number(parts[1]);

    if (!kategori || !nominal) {
      await sock.sendMessage(chatId, {
        text: "Format salah. Contoh: !makan 25000"
      });
      return;
    }

    const tipe = kategori.toLowerCase() === "gaji" ? "masuk" : "keluar";

    try {
      await axios.post("http://localhost:3000/transaksi", {
        kategori,
        nominal,
        tipe
      });

      await sock.sendMessage(chatId, {
        text: `✅ Transaksi dicatat

Kategori: ${kategori}
Nominal: Rp${nominal.toLocaleString("id-ID")}
Tipe: ${tipe}`
      });
    } catch (error) {
      console.log("ERROR AXIOS:", error.message);

      await sock.sendMessage(chatId, {
        text: `Gagal mencatat transaksi:\n${error.message}`
      });
    }
  });

  sock.ev.on("creds.update", saveCreds);
}

startBot();