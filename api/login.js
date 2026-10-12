export default async function handler(req, res) {
  // CORS başlıklarını ekliyoruz ki tarayıcı hiçbir şekilde engellemesin
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Google Apps Script Web Uygulaması Linkiniz (Yeni sürüm linkiniz)
  const GOOGLE_BACKEND_URL = "https://script.google.com/macros/s/AKfycbx1QUIqVK_HpGGryDubNm4RmuQelhGbuDb71qX8GX5PiqtcVUjZtJtoIJ3jPg7XePZ7/exec";

  try {
    const response = await fetch(GOOGLE_BACKEND_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body)
    });
    
    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ ok: false, message: "Köprü sunucu hatası: " + error.message });
  }
}
