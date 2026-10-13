export default async function handler(req, res) {
  const SPREADSHEET_ID = "1wwW48GDy5sssSMO1o7j1U_qBLiklfGU7og1lYd-2Duo";
  const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:csv`;

  try {
    const response = await fetch(url);
    const csvText = await response.text();

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.status(200).send(csvText);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
}
