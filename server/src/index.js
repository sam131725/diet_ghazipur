require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const routes = require('./routes');
const { uploadDir } = require('./middleware');

if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET missing. Copy .env.example to .env and set it.');
  process.exit(1);
}

const app = express();
app.set('trust proxy', 1);   // behind Render / Railway / any reverse proxy
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({ origin: (process.env.CLIENT_ORIGIN || '').split(',').filter(Boolean) }));
app.use(express.json({ limit: '1mb' }));
app.use(morgan('tiny'));
app.use('/uploads', express.static(uploadDir, { maxAge: '7d' }));
app.use('/api', routes);

// Serve the built React app in production (single-server deploy)
const dist = path.join(__dirname, '..', '..', 'client', 'dist');
if (fs.existsSync(dist)) {
  app.use(express.static(dist));
  app.get(/^\/(?!api|uploads).*/, (_req, res) => res.sendFile(path.join(dist, 'index.html')));
}

app.use((err, _req, res, _next) => {
  const status = err.code === 'LIMIT_FILE_SIZE' ? 413 : err.status || 400;
  if (err.code === 11000) return res.status(400).json({ message: 'Duplicate entry' });
  res.status(status).json({ message: err.message || 'Server error' });
});

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/diet_ghazipur')
  .then(() => app.listen(process.env.PORT || 5000, () =>
    console.log(`API running on http://localhost:${process.env.PORT || 5000}`)))
  .catch((e) => { console.error('MongoDB connection failed:', e.message); process.exit(1); });
