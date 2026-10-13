const SPREADSHEET_ID = "1wwW48GDy5sssSMO1o7j1U_qBLiklfGU7og1lYd-2Duo";
const SHEET_NAME = "Harcamalar";

function doGet() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sh = ss.getSheetByName(SHEET_NAME);
    if (!sh) {
      const names = ss.getSheets().map(s => s.getName()).join(", ");
      return out({ error: "'" + SHEET_NAME + "' sekmesi bulunamadı. Mevcut sekmeler: " + names });
    }
    const tz = ss.getSpreadsheetTimeZone();
    const values = sh.getDataRange().getValues();
    const headers = values[0].map(h => String(h).trim().toLowerCase());

    // Önce başlık adına bakar, bulamazsa eski sütun sırasına döner (B,C,D,E,I,N)
    const col = (name, fallback) => {
      const i = headers.indexOf(name);
      return i >= 0 ? i : fallback;
    };
    const cPeriod = col("period", 1), cDate = col("date", 2), cDesc = col("description", 3),
          cCat = col("category", 4), cCredit = col("credit", 8), cCash = col("cash", 13);

    const fmtDate = (v, pattern) =>
      v instanceof Date ? Utilities.formatDate(v, tz, pattern) : String(v === null ? "" : v);
    const num = v => {
      if (typeof v === "number") return v;
      let s = String(v || "").replace(/[₺\s]/g, "");
      if (s.indexOf(",") >= 0) s = s.replace(/\./g, "").replace(",", ".");
      return parseFloat(s) || 0;
    };

    const records = [];
    for (let i = 1; i < values.length; i++) {
      const r = values[i];
      const description = String(r[cDesc] || "").trim();
      const date = fmtDate(r[cDate], "yyyy-MM-dd");
      if (!description && !date) continue;
      records.push({
        period: fmtDate(r[cPeriod], "yyyy-MM"),
        date: date,
        description: description,
        category: String(r[cCat] || ""),
        credit: num(r[cCredit]),
        cash: num(r[cCash])
      });
    }
    return out({ ok: true, count: records.length, headers: headers, records: records });
  } catch (err) {
    return out({ error: String(err) });
  }
}

function out(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
