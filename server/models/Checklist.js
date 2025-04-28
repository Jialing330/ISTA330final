const mongoose = require('mongoose');

const checklistSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  character: { type: String, required: true },
  season: { type: String, required: true },
  items: [{ name: String, checked: Boolean }]
});

module.exports = mongoose.model('Checklist', checklistSchema);
