import mongoose from 'mongoose';

const battleSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  promptText: { type: String, required: true },
  results: { type: Object, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Battle = mongoose.model('Battle', battleSchema);

export default Battle;
