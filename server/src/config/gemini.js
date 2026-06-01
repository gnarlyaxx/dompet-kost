const Groq = require('groq-sdk');

if (!process.env.GROQ_API_KEY) {
  console.warn('⚠️  GROQ_API_KEY tidak ditemukan di .env!');
}

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || '' });

const systemPrompt = `Kamu adalah asisten keuangan cerdas bernama DompetKost AI. 
Kamu membantu mahasiswa dan anak kost di Indonesia mengelola keuangan mereka.
Berikan tips hemat, analisis pengeluaran, dan rekomendasi budgeting yang praktis.
Jawab dalam Bahasa Indonesia yang ramah dan mudah dipahami.
Gunakan emoji untuk membuat jawaban lebih menarik.
Batas jawaban maksimal 300 kata agar tidak terlalu panjang.`;

async function chat(historyOrMessage) {
  try {
    // kita support gaya lama (teks doang) sama gaya baru (ngirim sekalian history chat)
    let messages = [{ role: 'system', content: systemPrompt }];
    
    if (typeof historyOrMessage === 'string') {
      messages.push({ role: 'user', content: historyOrMessage });
    } else if (Array.isArray(historyOrMessage)) {
      // bersihin format history-nya biar rapi dan gak error pas dikirim ke Groq
      const formattedHistory = historyOrMessage.map(m => ({
        role: m.role,
        content: m.content
      }));
      messages = [...messages, ...formattedHistory];
    }

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: messages,
      temperature: 0.7,
      max_tokens: 512,
    });
    return completion.choices[0]?.message?.content || 'Maaf, tidak ada jawaban.';
  } catch (err) {
    console.error('Groq error:', err.message);
    throw new Error('Groq API gagal: ' + err.message);
  }
}

module.exports = { chat };
