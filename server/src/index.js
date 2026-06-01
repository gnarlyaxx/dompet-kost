const express = require('express');
const cors = require('cors');
require('dotenv').config();

const transactionsRouter = require('./routes/transactions');
const budgetRouter = require('./routes/budget');
const chatRouter = require('./routes/chat');
const remindersRouter = require('./routes/reminders');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'DompetKost API is running' });
});

app.use('/api/transactions', transactionsRouter);
app.use('/api/budget', budgetRouter);
app.use('/api/chat', chatRouter);
app.use('/api/reminders', remindersRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`DompetKost server running on port ${PORT}`);
});
