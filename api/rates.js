// /api/rates.js
// Vercel Serverless Function — fetches mortgage rates from FRED server-side
// (no CORS issues since this runs on the server, not the browser)
// Triggered automatically every Thursday at noon UTC via vercel.json cron

export default async function handler(req, res) {

  // Allow the response to be cached by Vercel's CDN for up to 24 hours
  // This means even if many users visit, FRED only gets called once per day max
  res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate');
  res.setHeader('Access-Control-Allow-Origin', '*');

  const FRED_BASE = 'https://api.stlouisfed.org/fred/series/observations';
  // Store your FRED API key as a Vercel Environment Variable named FRED_API_KEY
  // Vercel Dashboard → Project → Settings → Environment Variables → Add: FRED_API_KEY
  const API_KEY = process.env.FRED_API_KEY;

  if (!API_KEY) {
    return res.status(500).json({ error: 'FRED_API_KEY environment variable not set' });
  }

  const series = ['MORTGAGE30US', 'MORTGAGE15US', 'MORTGAGE5US'];

  async function fetchSeries(sid) {
    try {
      const url = `${FRED_BASE}?series_id=${sid}&api_key=${API_KEY}&file_type=json&sort_order=desc&limit=2`;
      const response = await fetch(url);
      if (!response.ok) throw new Error(`FRED returned ${response.status}`);
      const data = await response.json();
      const obs = data.observations;
      if (!obs || obs.length === 0) return null;

      // FRED sometimes returns '.' for missing values — handle gracefully
      const currentVal = obs[0].value === '.' ? null : parseFloat(obs[0].value);
      const prevVal    = (!obs[1] || obs[1].value === '.') ? currentVal : parseFloat(obs[1].value);

      return {
        value:  currentVal,
        change: currentVal !== null && prevVal !== null ? currentVal - prevVal : 0,
        date:   obs[0].date
      };
    } catch (err) {
      console.error(`Failed to fetch ${sid}:`, err.message);
      return null;
    }
  }

  try {
    const results = await Promise.all(series.map(sid => fetchSeries(sid)));
    const rates = {};
    series.forEach((sid, i) => {
      rates[sid] = results[i];
    });
    return res.status(200).json(rates);
  } catch (err) {
    console.error('Rate fetch error:', err);
    return res.status(500).json({ error: 'Failed to fetch rates' });
  }
}
