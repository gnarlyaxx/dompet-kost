const express = require('express');
const router = express.Router();
const { supabase } = require('../config/supabase');
const { requireAuth } = require('../middleware/auth');

// semua endpoint di sini wajib login dulu bos
router.use(requireAuth);

// tarik data budget bulan ini punya user yang lagi login
router.get('/', async (req, res, next) => {
  try {
    const now = new Date();
    const { data, error } = await supabase
      .from('budgets')
      .select('*')
      .eq('user_id', req.user.id)
      .eq('month', now.getMonth() + 1)
      .eq('year', now.getFullYear())
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    res.json(data || { amount: 1500000, month: now.getMonth() + 1, year: now.getFullYear() });
  } catch (err) { next(err); }
});

// nyimpen atau ngupdate settingan budget
router.put('/', async (req, res, next) => {
  try {
    const { amount } = req.body;
    const now = new Date();
    const { data, error } = await supabase
      .from('budgets')
      .upsert({
        user_id: req.user.id,  // paksa pake id dari token biar aman
        amount,
        month: now.getMonth() + 1,
        year: now.getFullYear()
      }, { onConflict: 'user_id,month,year' })
      .select();

    if (error) throw error;
    res.json(data[0]);
  } catch (err) { next(err); }
});

module.exports = router;
