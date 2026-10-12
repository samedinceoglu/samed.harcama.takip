export default async function handler(req, res) {
  // CORS güvenlik ayarları
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Sizin güncel Supabase bağlantı bilgileriniz
  const SUPABASE_URL = "https://supabase.co";
  const SUPABASE_KEY = "sb_publishable_F4JK93h5B697yFPu1U-ppw_HAgFYMKZ";

  const { action, username, password, record, id } = req.body || {};

  // 1. Basit Kullanıcı Giriş Kontrolü
  if (action === "login") {
    if (username === "Samed" && password !== "") {
      return res.status(200).json({ ok: true });
    }
    return res.status(401).json({ ok: false, message: "Kullanıcı adı veya şifre hatalı." });
  }

  // 2. Tablo Eşleştirme Mantığı
  let targetTable = "harcamalar";
  if (action && action.toLowerCase().includes("income")) targetTable = "gelirler";
  if (action && action.toLowerCase().includes("debt")) targetTable = "borclar";
  if (action && action.toLowerCase().includes("upcoming")) targetTable = "yaklasan_odemeler";
  if (action && action.toLowerCase().includes("asset")) targetTable = "varlik_borc";

  try {
    let response;
    
    // VERİ ÇEKME İŞLEMİ (getBootstrapData)
    if (action === "getBootstrapData") {
      response = await fetch(`${SUPABASE_URL}/rest/v1/${targetTable}?select=*`, {
        method: "GET",
        headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}` }
      });
      const data = await response.json();
      return res.status(200).json({ ok: true, data: data });
    }

    // VERİ SİLME İŞLEMLERİ
    if (action && action.startsWith("delete")) {
      response = await fetch(`${SUPABASE_URL}/rest/v1/${targetTable}?id=eq.${id}`, {
        method: "DELETE",
        headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}`, "Prefer": "return=representation" }
      });
      const data = await response.json();
      return res.status(200).json({ ok: true, data: data });
    }

    // VERİ KAYDETME / GÜNCELLEME İŞLEMLERİ
    response = await fetch(`${SUPABASE_URL}/rest/v1/${targetTable}`, {
      method: "POST",
      headers: { 
        "apikey": SUPABASE_KEY, 
        "Authorization": `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
        "Prefer": "return=representation" 
      },
      body: JSON.stringify(record)
    });
    const data = await response.json();
    return res.status(200).json({ ok: true, data: data });

  } catch (error) {
    return res.status(500).json({ ok: false, message: "Sunucu köprü hatası: " + error.message });
  }
}
