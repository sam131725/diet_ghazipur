const mongoose = require('mongoose');
const { Schema } = mongoose;
const opts = { timestamps: true };

// Roles: admin (full control), staff (DIET employees: publish content, review applications), student
const User = mongoose.model('User', new Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: String,
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'staff', 'student'], default: 'student' },
  designation: String,          // staff only
  enrollmentNo: String,         // student only
  batch: String,                // student only
  active: { type: Boolean, default: true },
}, opts));

const Notice = mongoose.model('Notice', new Schema({
  title: { type: String, required: true },
  titleHi: String,
  descriptionHi: String,
  description: String,
  category: { type: String, enum: ['Pre-Service', 'In-Service', 'Examination', 'General'], default: 'General' },
  fileUrl: String,
  showNew: { type: Boolean, default: true },
  publishedAt: { type: Date, default: Date.now },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
}, opts));

const Carousel = mongoose.model('Carousel', new Schema({
  title: String,
  titleHi: String,
  subtitle: String,
  subtitleHi: String,
  imageUrl: { type: String, required: true },
  order: { type: Number, default: 0 },
  active: { type: Boolean, default: true },
}, opts));

const Gallery = mongoose.model('Gallery', new Schema({
  caption: String,
  captionHi: String,
  imageUrl: { type: String, required: true },
  album: { type: String, default: 'General' },
}, opts));

const Event = mongoose.model('Event', new Schema({
  title: { type: String, required: true },
  titleHi: String,
  descriptionHi: String,
  category: { type: String, default: 'Academic' },
  date: { type: Date, required: true },
  venue: String,
  description: String,
}, opts));

// Course / training registration form
const Registration = mongoose.model('Registration', new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  program: { type: String, required: true },   // e.g. D.El.Ed. 2026-28, NISHTHA, Internship
  fullName: { type: String, required: true },
  fatherName: String,
  dob: Date,
  gender: String,
  category: String,
  phone: { type: String, required: true },
  email: String,
  address: String,
  qualification: String,
  marksPercent: Number,
  documents: [String],
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  remarks: String,
  applicationNo: { type: String, unique: true },
}, opts));

const Contact = mongoose.model('Contact', new Schema({
  name: String, email: String, phone: String, message: String,
  resolved: { type: Boolean, default: false },
}, opts));

// Uploaded documents shown in tables on section pages (AWP, downloads, examination, etc.)
const Doc = mongoose.model('Doc', new Schema({
  section: { type: String, required: true, index: true },  // e.g. 'awp', 'downloads', 'examination/results'
  group: String,                                           // AWP session (2025-26) or downloads category
  title: { type: String, required: true },
  titleHi: String,
  details: String,
  detailsHi: String,
  fromDate: Date,
  toDate: Date,
  fileUrl: String,
}, opts));

const Person = mongoose.model('Person', new Schema({
  type: { type: String, enum: ['principal', 'former-principal', 'faculty', 'staff'], default: 'faculty', index: true },
  name: { type: String, required: true },
  nameHi: String,
  designation: String,          // role shown under the name (Principal, Senior Lecturer, ...)
  designationHi: String,
  branch: String,               // subject / branch
  branchHi: String,
  qualification: String,
  phone: String,
  email: String,
  message: String,              // principal's message
  messageHi: String,
  fromYear: String,             // former principals
  toYear: String,
  photoUrl: String,
  order: { type: Number, default: 0 },
}, opts));

const Setting = mongoose.model('Setting', new Schema({
  key: { type: String, unique: true },
  value: Schema.Types.Mixed,
}, opts));

const FileBlob = mongoose.model('FileBlob', new mongoose.Schema({
  name: String, mime: { type: String, required: true }, size: Number,
  data: { type: Buffer, required: true },
}, { timestamps: true }));

module.exports = { Person, FileBlob, User, Notice, Carousel, Gallery, Event, Registration, Contact, Setting, Doc };
