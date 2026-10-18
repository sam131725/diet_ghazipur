require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const M = require('./models');

(async () => {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/diet_ghazipur');
  const email = (process.env.ADMIN_EMAIL || 'admin@dietghazipur.ac.in').toLowerCase();
  if (!(await M.User.findOne({ email }))) {
    await M.User.create({
      name: 'DIET Administrator', email, role: 'admin',
      password: await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Admin@12345', 10),
    });
    console.log('Admin created:', email);
  } else console.log('Admin already exists');

  if (!(await M.Notice.countDocuments())) {
    await M.Notice.insertMany([
      { title: 'Internship of eligible trainees of the fourth semester of D.El.Ed.', category: 'Pre-Service', description: 'Sample notice for demo.' },
      { title: 'Three-day training for principals of government and government-aided schools', category: 'In-Service' },
      { title: 'Quarterly Teacher Cluster Meeting', category: 'In-Service' },
      { title: 'Detailed instructions for D.El.Ed. trainees and institutions', category: 'Pre-Service' },
    ]);
  }
  if (!(await M.Event.countDocuments())) {
    const d = (n) => new Date(Date.now() + n * 86400000);
    await M.Event.insertMany([
      { title: 'Workshop: Inclusive Education', category: 'Academic', date: d(7), venue: 'DIET Ghazipur Hall' },
      { title: 'Training Program: NISHTHA Module', category: 'Training', date: d(14), venue: 'Seminar Room' },
      { title: 'Seminar: Innovation & Research', category: 'Research', date: d(21), venue: 'Auditorium' },
    ]);
  }
  console.log('Seed complete');
  process.exit(0);
})();
