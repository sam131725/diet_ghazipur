const express = require('express');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const rateLimit = require('express-rate-limit');
const M = require('./models');
const { persistFiles, upload, fileUrl, sign, auth, wrap, uploadDir } = require('./middleware');

const r = express.Router();

// ---------- Real-time (Server-Sent Events) ----------
const clients = new Set();
const broadcast = (type) => clients.forEach((res) => res.write(`data: ${JSON.stringify({ type, t: Date.now() })}\n\n`));
r.get('/stream', (req, res) => {
  res.set({ 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive' });
  res.flushHeaders();
  res.write('retry: 5000\n\n');
  clients.add(res);
  const ping = setInterval(() => res.write(': ping\n\n'), 25000);
  req.on('close', () => { clearInterval(ping); clients.delete(res); });
});

// ---------- Auth ----------
const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 30, message: { message: 'Too many attempts, try later' } });

// portal: 'student' or 'staff' (staff login also accepts admin)
r.post('/auth/login', loginLimiter, wrap(async (req, res) => {
  const { email, password, portal } = req.body;
  const user = await M.User.findOne({ email: String(email || '').toLowerCase() });
  if (!user || !(await bcrypt.compare(password || '', user.password)))
    return res.status(400).json({ message: 'Invalid email or password' });
  const allowed = portal === 'student' ? ['student'] : ['staff', 'admin'];
  if (!allowed.includes(user.role))
    return res.status(403).json({ message: `This account cannot log in to the ${portal} portal` });
  if (!user.active) return res.status(403).json({ message: 'Account disabled' });
  res.json({ token: sign(user), user: { id: user._id, name: user.name, email: user.email, role: user.role } });
}));

r.post('/auth/register', loginLimiter, wrap(async (req, res) => {
  // Public self-registration is for students only
  const { name, email, phone, password, enrollmentNo, batch } = req.body;
  if (!name || !email || !password || password.length < 8)
    return res.status(400).json({ message: 'Name, email and a password of 8+ characters are required' });
  if (await M.User.findOne({ email: email.toLowerCase() }))
    return res.status(400).json({ message: 'Email already registered' });
  const user = await M.User.create({
    name, email, phone, enrollmentNo, batch, role: 'student', password: await bcrypt.hash(password, 10),
  });
  res.status(201).json({ token: sign(user), user: { id: user._id, name: user.name, email: user.email, role: user.role } });
}));

r.get('/auth/me', auth(), (req, res) => res.json(req.user));

// ---------- Generic CRUD helper for content ----------
const staffOrAdmin = auth(['staff', 'admin']);

function content({ name, Model, sort, fileField, publicList = true, textFields }) {
  const base = `/${name}`;
  if (publicList)
    r.get(base, wrap(async (req, res) => {
      const q = {};
      if (req.query.category && req.query.category !== 'All') q.category = req.query.category;
      if (req.query.active === '1') q.active = true;
      if (req.query.section) q.section = req.query.section;
      if (req.query.group && req.query.group !== 'All') q.group = req.query.group;
      if (req.query.type) q.type = req.query.type;
      res.json(await Model.find(q).sort(sort).limit(Number(req.query.limit) || 200));
    }));

  r.post(base, staffOrAdmin, upload.single('file'), persistFiles, wrap(async (req, res) => {
    const data = {};
    textFields.forEach((f) => { if (req.body[f] !== undefined) data[f] = req.body[f]; });
    if (req.file) data[fileField] = fileUrl(req.file);
    if (name === 'notices') data.createdBy = req.user._id;
    const doc = await Model.create(data);
    broadcast(name);
    res.status(201).json(doc);
  }));

  r.put(`${base}/:id`, staffOrAdmin, upload.single('file'), persistFiles, wrap(async (req, res) => {
    const data = {};
    textFields.forEach((f) => { if (req.body[f] !== undefined) data[f] = req.body[f]; });
    if (req.file) data[fileField] = fileUrl(req.file);
    const doc = await Model.findByIdAndUpdate(req.params.id, data, { new: true });
    if (!doc) return res.status(404).json({ message: 'Not found' });
    broadcast(name);
    res.json(doc);
  }));

  r.delete(`${base}/:id`, staffOrAdmin, wrap(async (req, res) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Not found' });
    const url = doc[fileField];
    if (url && url.startsWith('/api/files/')) M.FileBlob.findByIdAndDelete(url.split('/').pop()).catch(() => {});
    else if (url && url.startsWith('/uploads/')) fs.unlink(path.join(uploadDir, path.basename(url)), () => {});
    broadcast(name);
    res.json({ ok: true });
  }));
}

r.get('/files/:id', wrap(async (req, res) => {
  if (!/^[a-f0-9]{24}$/i.test(req.params.id)) return res.status(404).end();
  const f = await M.FileBlob.findById(req.params.id);
  if (!f) return res.status(404).end();
  res.set({ 'Content-Type': f.mime, 'Cache-Control': 'public, max-age=604800, immutable',
    'Content-Disposition': `inline; filename="${encodeURIComponent(f.name || 'file')}"` });
  res.send(f.data);
}));

content({ name: 'notices', Model: M.Notice, sort: { publishedAt: -1 }, fileField: 'fileUrl',
  textFields: ['title', 'titleHi', 'description', 'descriptionHi', 'category', 'showNew', 'publishedAt'] });
content({ name: 'carousel', Model: M.Carousel, sort: { order: 1, createdAt: -1 }, fileField: 'imageUrl',
  textFields: ['title', 'titleHi', 'subtitle', 'subtitleHi', 'order', 'active'] });
content({ name: 'gallery', Model: M.Gallery, sort: { createdAt: -1 }, fileField: 'imageUrl',
  textFields: ['caption', 'captionHi', 'album'] });
content({ name: 'events', Model: M.Event, sort: { date: 1 }, fileField: 'fileUrl',
  textFields: ['title', 'titleHi', 'category', 'date', 'venue', 'description', 'descriptionHi'] });

content({ name: 'docs', Model: M.Doc, sort: { fromDate: 1, createdAt: -1 }, fileField: 'fileUrl',
  textFields: ['section', 'group', 'title', 'titleHi', 'details', 'detailsHi', 'fromDate', 'toDate'] });

content({ name: 'people', Model: M.Person, sort: { order: 1, createdAt: 1 }, fileField: 'photoUrl',
  textFields: ['type', 'name', 'nameHi', 'designation', 'designationHi', 'branch', 'branchHi', 'qualification', 'phone', 'email',
    'message', 'messageHi', 'fromYear', 'toYear', 'order'] });

// ---------- Visitor counter (one count per browser session) ----------
r.post('/visit', wrap(async (_req, res) => {
  const s = await M.Setting.findOneAndUpdate({ key: 'visitors' }, { $inc: { value: 1 } }, { upsert: true, new: true });
  res.json({ count: s.value });
}));
r.get('/visit', wrap(async (_req, res) => {
  const s = await M.Setting.findOne({ key: 'visitors' });
  res.json({ count: s ? s.value : 0 });
}));

// ---------- Site search ----------
r.get('/search', wrap(async (req, res) => {
  const q = String(req.query.q || '').trim().slice(0, 60);
  if (q.length < 2) return res.json({ notices: [], docs: [], events: [] });
  const rx = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
  const [notices, docs, events] = await Promise.all([
    M.Notice.find({ $or: [{ title: rx }, { description: rx }] }).sort({ publishedAt: -1 }).limit(20),
    M.Doc.find({ $or: [{ title: rx }, { details: rx }] }).sort({ createdAt: -1 }).limit(20),
    M.Event.find({ $or: [{ title: rx }, { description: rx }] }).sort({ date: -1 }).limit(20),
  ]);
  res.json({ notices, docs, events });
}));

// ---------- Registrations / applications ----------
r.post('/registrations', auth(['student']), upload.array('documents', 5), persistFiles, wrap(async (req, res) => {
  const count = await M.Registration.countDocuments();
  const doc = await M.Registration.create({
    ...req.body,
    user: req.user._id,
    documents: (req.files || []).map(fileUrl),
    applicationNo: `DIETGZP-${new Date().getFullYear()}-${String(count + 1).padStart(5, '0')}`,
  });
  broadcast('registrations');
  res.status(201).json(doc);
}));

r.get('/registrations/mine', auth(['student']), wrap(async (req, res) =>
  res.json(await M.Registration.find({ user: req.user._id }).sort({ createdAt: -1 }))));

r.get('/registrations', staffOrAdmin, wrap(async (req, res) => {
  const q = req.query.status ? { status: req.query.status } : {};
  res.json(await M.Registration.find(q).sort({ createdAt: -1 }).limit(500));
}));

r.patch('/registrations/:id', staffOrAdmin, wrap(async (req, res) => {
  const { status, remarks } = req.body;
  const doc = await M.Registration.findByIdAndUpdate(req.params.id, { status, remarks }, { new: true });
  if (!doc) return res.status(404).json({ message: 'Not found' });
  broadcast('registrations');
  res.json(doc);
}));

// ---------- Contact form ----------
r.post('/contact', rateLimit({ windowMs: 60 * 1000, max: 5 }), wrap(async (req, res) => {
  const { name, email, phone, message } = req.body;
  if (!name || !message) return res.status(400).json({ message: 'Name and message are required' });
  await M.Contact.create({ name, email, phone, message });
  res.status(201).json({ ok: true });
}));
r.get('/contact', staffOrAdmin, wrap(async (_req, res) => res.json(await M.Contact.find().sort({ createdAt: -1 }).limit(200))));
r.patch('/contact/:id', staffOrAdmin, wrap(async (req, res) =>
  res.json(await M.Contact.findByIdAndUpdate(req.params.id, { resolved: !!req.body.resolved }, { new: true }))));

// ---------- Admin: staff & user management ----------
r.get('/users', auth(['admin']), wrap(async (req, res) => {
  const q = req.query.role ? { role: req.query.role } : {};
  res.json(await M.User.find(q).select('-password').sort({ createdAt: -1 }).limit(500));
}));

r.post('/users', auth(['admin']), wrap(async (req, res) => {
  const { name, email, phone, password, role, designation } = req.body;
  if (!['staff', 'admin', 'student'].includes(role)) return res.status(400).json({ message: 'Invalid role' });
  if (!password || password.length < 8) return res.status(400).json({ message: 'Password must be 8+ characters' });
  const user = await M.User.create({ name, email, phone, role, designation, password: await bcrypt.hash(password, 10) });
  res.status(201).json({ id: user._id });
}));

r.patch('/users/:id', auth(['admin']), wrap(async (req, res) => {
  const data = {};
  if (req.body.active !== undefined) data.active = !!req.body.active;
  if (req.body.password) data.password = await bcrypt.hash(req.body.password, 10);
  if (String(req.params.id) === String(req.user._id) && data.active === false)
    return res.status(400).json({ message: 'You cannot disable your own account' });
  await M.User.findByIdAndUpdate(req.params.id, data);
  res.json({ ok: true });
}));

r.delete('/users/:id', auth(['admin']), wrap(async (req, res) => {
  if (!/^[a-f0-9]{24}$/i.test(req.params.id)) return res.status(404).json({ message: 'Not found' });
  if (String(req.params.id) === String(req.user._id)) return res.status(400).json({ message: 'You cannot delete your own account' });
  const target = await M.User.findById(req.params.id);
  if (!target) return res.status(404).json({ message: 'Not found' });
  if (target.role === 'admin' && (await M.User.countDocuments({ role: 'admin' })) <= 1)
    return res.status(400).json({ message: 'The last admin account cannot be deleted' });
  await target.deleteOne();
  broadcast('users');
  res.json({ ok: true });
}));

// ---------- Dashboard stats ----------
r.get('/stats', staffOrAdmin, wrap(async (_req, res) => {
  const [notices, gallery, events, students, pending, messages] = await Promise.all([
    M.Notice.countDocuments(), M.Gallery.countDocuments(), M.Event.countDocuments(),
    M.User.countDocuments({ role: 'student' }), M.Registration.countDocuments({ status: 'Pending' }),
    M.Contact.countDocuments({ resolved: false }),
  ]);
  res.json({ notices, gallery, events, students, pending, messages });
}));

module.exports = r;
