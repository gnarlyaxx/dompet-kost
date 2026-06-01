const express = require('express');
const router = express.Router();
const { supabase } = require('../config/supabase');
const { requireAuth } = require('../middleware/auth');

// semua endpoint di sini wajib login dulu bos
router.use(requireAuth);

// tarik data transaksi punya user yang lagi login
router.get('/', async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', req.user.id)
      .order('date', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (err) { next(err); }
});

// nambah transaksi, id usernya dipaksa dari token biar gak bisa di-hack
router.post('/', async (req, res, next) => {
  try {
    const { type, amount, description, category, date } = req.body;
    const { data, error } = await supabase
      .from('transactions')
      .insert([{ user_id: req.user.id, type, amount, description, category, date }])
      .select();

    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (err) { next(err); }
});

// ngapus transaksi, pastiin cuma punya dia sendiri yang kehapus
router.delete('/:id', async (req, res, next) => {
  try {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', req.user.id); // ngecek dua kali biar pasti punya dia

    if (error) throw error;
    res.json({ message: 'Deleted' });
  } catch (err) { next(err); }
});

module.exports = router;
