const { createClient } = require('@supabase/supabase-js');

// pake supabase buat ngecek beneran user yang login apa bukan
const supabaseAuth = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_KEY || ''
);

async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Token tidak ditemukan' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const { data: { user }, error } = await supabaseAuth.auth.getUser(token);
    if (error || !user) {
      return res.status(401).json({ error: 'Unauthorized: Token tidak valid' });
    }
    req.user = user; // nempelin data user ke request biar bisa dipake di route lain
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized: Gagal verifikasi token' });
  }
}

module.exports = { requireAuth };
