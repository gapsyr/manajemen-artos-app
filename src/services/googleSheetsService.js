const { google } = require("googleapis");

const auth = new google.auth.GoogleAuth({
  keyFile: "./src/config/google-credentials.json",
  scopes: [
    "https://www.googleapis.com/auth/spreadsheets"
  ]
});

const spreadsheetId =
  "1HdgtulqMgTiL3k0a2PpavCZz9k4Lv1VeefIhtinOVpc";

async function tambahKeSpreadsheet(data) {
  const client = await auth.getClient();

  const sheets = google.sheets({
    version: "v4",
    auth: client
  });

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: "Sheet1!A:D",
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [
        [
          data.tanggal,
          data.kategori,
          data.nominal,
          data.tipe
        ]
      ]
    }
  });
}

module.exports = {
  tambahKeSpreadsheet
};