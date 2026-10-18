const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const { User, FileBlob } = require('./models');

const uploadDir = path.join(__dirname, '..', 'uploads');
fs.mkdirSync(uploadDir, { recursive: true });

const ALLOWED = {
  'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp',
  'application/pdf': '.pdf',
};

const storage = multer.memoryStorage(); // files are saved into MongoDB by persistFiles below

const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 }, // 8 MB
  fileFilter: (_req, file, cb) =>
    ALLOWED[file.mimetype] ? cb(null, true) : cb(new Error('Only JPG, PNG, WEBP or PDF files are allowed')),
});

const fileUrl = (f) => (f ? f.url : undefined);

// Runs after multer: stores each uploaded file in MongoDB and records its URL on the file object.
const persistFiles = async (req, _res, next) => {
  try {
    const files = [].concat(req.file || [], req.files || []);
    for (const f of files) {
      const blob = await FileBlob.create({ name: f.originalname, mime: f.mimetype, size: f.size, data: f.buffer });
      f.url = `/api/files/${blob._id}`;
      delete f.buffer;
    }
    next();
  } catch (e) { next(e); }
};

const sign = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '8h' });

const auth = (roles = []) => async (req, res, next) => {
  try {
    const h = req.headers.authorization || '';
    const token = h.startsWith('Bearer ') ? h.slice(7) : null;
    if (!token) return res.status(401).json({ message: 'Login required' });
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.id).select('-password');
    if (!user || !user.active) return res.status(401).json({ message: 'Account disabled' });
    if (roles.length && !roles.includes(user.role)) return res.status(403).json({ message: 'Not allowed' });
    req.user = user;
    next();
  } catch {
    res.status(401).json({ message: 'Session expired, please login again' });
  }
};

const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

module.exports = { persistFiles, upload, fileUrl, sign, auth, wrap, uploadDir };
