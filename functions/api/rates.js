// /functions/api/rates.js
// Cloudflare Pages Function — fetches mortgage rates from FRED server-side
// (no CORS issues since this runs on the server, not the browser)

export async function onRequest(context) {
  const API_KEY = context.env.FRED_API_KEY;

  if (!API_KEY) {
    return new Response(JSON.stringify({ error: 'FRED_API_KEY environment variable not set' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const FRED_BASE = 'https://api.stlouisfed.org/fred/series/observations';
  const series = ['MORTGAGE30US', 'MORTGAGE15US', 'MORTGAGE5US'];

  async function fetchSeries(sid) {
    try {
      const since = new Date();
      since.setDate(since.getDate() - 60);
      const sinceStr = since.toISOString().split('T')[0];

      const url = `${FRED_BASE}?series_id=${sid}&api_key=${API_KEY}&file_type=json&sort_order=desc&limit=2&observation_start=${sinceStr}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error(`FRED returned ${response.status}`);
      const data = await response.json();
      const obs = data.observations;
      if (!obs || obs.length === 0) return null;

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
    series.forEach((sid, i) => { rates[sid] = results[i]; });

    return new Response(JSON.stringify(rates), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 's-maxage=86400, stale-while-revalidate',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (err) {
    console.error('Rate fetch error:', err);
    return new Response(JSON.stringify({ error: 'Failed to fetch rates' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

