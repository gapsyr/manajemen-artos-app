const pino = require("pino");
const makeWASocket = require("@whiskeysockets/baileys").default;
const {
  useMultiFileAuthState,
  DisconnectReason
} = require("@whiskeysockets/baileys");

const qrcode = require("qrcode-terminal");

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("auth");

  const pino = require("pino");

const sock = makeWASocket({
  auth: state,
  logger: pino({ level: "silent" }),
  printQRInTerminal: false
});

  sock.ev.on("connection.update", update => {
    const { qr, connection, lastDisconnect } = update;

    if (qr) {
      qrcode.generate(qr, { small: true });
    }

    if (connection === "open") {
      console.log("WhatsApp terhubung");
    }

    if (connection === "close") {
      const statusCode =
        lastDisconnect?.error?.output?.statusCode;

      console.log("Koneksi tertutup:", statusCode);

      const shouldReconnect =
        statusCode !== DisconnectReason.loggedOut;

      if (shouldReconnect) {
        console.log("Mencoba menyambungkan ulang...");
        startBot();
      } else {
        console.log("Logout. Hapus folder auth lalu scan ulang QR.");
      }
    }
  });

  sock.ev.on("creds.update", saveCreds);
}

startBot();