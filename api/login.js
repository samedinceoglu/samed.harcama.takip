export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const SUPABASE_URL = "https://supabase.co";
  const SUPABASE_KEY = "sb_publishable_F4JK93h5B697yFPu1U-ppw_HAgFYMKZ";

  try {
    let body = req.body;
    if (typeof body === 'string') {
      body = JSON.parse(body);
    }
    
    const { action } = body || {};

    if (action === "login") {
      return res.status(200).json({ ok: true });
    }

    const response = await fetch(`${SUPABASE_URL}/rest/v1/harcamalar?select=*`, {
      method: "GET",
      headers: { 
        "apikey": SUPABASE_KEY, 
        "Authorization": `Bearer ${SUPABASE_KEY}`,
        "Accept": "application/json"
      }
    });

    const data = await response.json();
    return res.status(200).json({ ok: true, data: data });

  } catch (error) {
    return res.status(500).json({ ok: false, message: error.toString() });
  }
}
const response = await fetch(`${SUPABASE_URL}/rest/v1/harcamalar?select=*`, {
      method: "GET",
      headers: { 
        "apikey": SUPABASE_KEY, 
        "Authorization": `Bearer ${SUPABASE_KEY}`,
        "Accept": "application/json"
      }
    });

    const data = await response.json();
    return res.status(200).json({ ok: true, data: data });

  } catch (error) {
    return res.status(500).json({ ok: false, message: error.toString() });
  }
}
