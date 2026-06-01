const express = require('express');
const router = express.Router();
const { supabase } = require('../config/supabase');
const { requireAuth } = require('../middleware/auth');

router.use(requireAuth);

// narik data pengingat punya user, bisa di-filter per bulan/tahun
router.get('/', async (req, res, next) => {
  try {
    const { month, year } = req.query;
    let query = supabase
      .from('reminders')
      .select('*')
      .eq('user_id', req.user.id)
      .order('date', { ascending: true });

    // nge-filter bulan sama tahun kalo dikirim dari frontend
    if (month && year) {
      const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
      const endDate = new Date(year, month, 0).toISOString().split('T')[0]; // ngambil tanggal terakhir di bulan itu
      query = query.gte('date', startDate).lte('date', endDate);
    }

    const { data, error } = await query;
    if (error) throw error;
    res.json(data);
  } catch (err) { next(err); }
});

// nge-post atau bikin pengingat baru
router.post('/', async (req, res, next) => {
  try {
    const { date, text } = req.body;
    if (!date || !text?.trim()) {
      return res.status(400).json({ error: 'Tanggal dan teks wajib diisi' });
    }
    const { data, error } = await supabase
      .from('reminders')
      .insert([{ user_id: req.user.id, date, text: text.trim() }])
      .select();
    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (err) { next(err); }
});

// ngapus pengingat, bye-bye
router.delete('/:id', async (req, res, next) => {
  try {
    const { error } = await supabase
      .from('reminders')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', req.user.id);
    if (error) throw error;
    res.json({ message: 'Deleted' });
  } catch (err) { next(err); }
});

module.exports = router;
