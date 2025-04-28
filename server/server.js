const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/auth');
const characterRoutes = require('./routes/character');
const checklistRoutes = require('./routes/checklist');

app.use('/api/auth', authRoutes);
app.use('/api/characters', characterRoutes);
app.use('/api/checklist', checklistRoutes);

mongoose.connect('mongodb://127.0.0.1:27017/community_center', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('✅ Connected to MongoDB');
  app.listen(8888, () => console.log('✅ Server running on http://localhost:8888'));
}).catch(err => console.error('❌ MongoDB connection error:', err));
