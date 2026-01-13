require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// Database
connectDB();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173','http://localhost:5174'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

app.use(require('./middleware/errorHandler'));


app.use('/api/auth', require('./routes/auth'));
app.use('/api/gigs', require('./routes/gigs')); 
app.use('/api/bids', require('./routes/bids'));



app.get('/api/health', (req, res) => {
  res.json({ message: 'GigFlow Backend ', timestamp: new Date() });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});
