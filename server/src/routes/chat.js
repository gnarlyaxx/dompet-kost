const express = require('express');
const router = express.Router();
const { chat } = require('../config/gemini');

router.post('/', async (req, res, next) => {
  try {
    const { message, history } = req.body;
    
    // plan B: kalo dikirimnya array history, pake itu. Kalo cuma teks doang, yaudah pake teksnya aja
    const chatInput = (history && Array.isArray(history)) ? history : message;

    if (!chatInput || (typeof chatInput === 'string' && chatInput.trim() === '') || (Array.isArray(chatInput) && chatInput.length === 0)) {
      return res.status(400).json({ error: 'Message or history is required' });
    }
    
    const reply = await chat(chatInput);
    res.json({ reply });
  } catch (err) {
    console.error('Chat error:', err.message);
    next(err);
  }
});

module.exports = router;
