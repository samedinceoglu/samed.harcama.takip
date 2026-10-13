export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const SUPABASE_URL = "https://xolniwgjhoeuyrvyrkme.supabase.co";
  const SUPABASE_KEY = "sb_publishable_F4JK93h5B697yFPu1U-ppw_HAgFYMKZ";

  try {
    let body = req.body;
    if (typeof body === 'string') {
      body = JSON.parse(body);
    }
    
    const { action, record, id } = body || {};

    if (action === "login") {
      return res.status(200).json({ ok: true });
    }

    // Modül / Tablo Seçimi
    let targetTable = "harcamalar";
    if (action && action.toLowerCase().includes("income")) targetTable = "gelirler";
    if (action && action.toLowerCase().includes("debt")) targetTable = "borclar";
    if (action && action.toLowerCase().includes("upcoming")) targetTable = "yaklasan_odemeler";
    if (action && action.toLowerCase().includes("asset")) targetTable = "varlik_borc";

    // 1. VERİ SİLME
    if (action && action.startsWith("delete")) {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/${targetTable}?id=eq.${id}`, {
        method: "DELETE",
        headers: { 
          "apikey": SUPABASE_KEY, 
          "Authorization": `Bearer ${SUPABASE_KEY}`,
          "Prefer": "return=representation" 
        }
      });
      const data = await response.json();
      return res.status(200).json({ ok: true, data });
    }

    // 2. YENİ KAYIT EKLEME
    if (action && action.startsWith("save")) {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/${targetTable}`, {
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
      return res.status(200).json({ ok: true, data });
    }

    // 3. VERİ OKUMA (GET)
    const response = await fetch(`${SUPABASE_URL}/rest/v1/${targetTable}?select=*`, {
      method: "GET",
      headers: { 
        "apikey": SUPABASE_KEY, 
        "Authorization": `Bearer ${SUPABASE_KEY}`,
        "Accept": "application/json"
      }
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).json({ ok: false, message: errText });
    }

    const data = await response.json();
    return res.status(200).json({ ok: true, data });

  } catch (error) {
    return res.status(500).json({ ok: false, message: error.toString() });
  }
}
