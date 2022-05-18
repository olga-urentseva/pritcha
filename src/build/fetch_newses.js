const https = require("https");
const marked = require("marked");

const SPREADSHEET_ID = "1BevqrPTNNPBrMB_nEsvLYk2wXD-CPiHVi3rzzoGwXq8";
const API_KEY = process.env.GOOGLE_SPREADSHEETS_API_KEY;

function fetch(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (resp) => {
        let data = "";

        resp.on("data", (chunk) => {
          data += chunk;
        });

        resp.on("end", () => {
          resolve(JSON.parse(data));
        });
      })
      .on("error", (err) => {
        reject(err);
      });
  });
}

async function fetchNewses() {
  const { values: rows } = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/newses!A2:C?key=${API_KEY}`
  );

  return rows.reverse().map(([title, text, date]) => {
    const textHTML = marked.parse(text);
    return { title, textHTML, date };
  });
}

module.exports = fetchNewses;
