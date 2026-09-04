import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  email: { type: String, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  name: { type: String, default: 'Nobonime fan' },
  language: { type: String, enum: ['en', 'fr'], default: 'en' },
  favorites: [{ type: String }],
  watchHistory: [{
    mediaId: { type: String, required: true },
    mediaType: { type: String, enum: ['anime', 'movie', 'series'], default: 'anime' },
    title: { type: String, default: '' },
    episode: { type: Number, min: 1, default: 1 },
    progressSeconds: { type: Number, min: 0, default: 0 },
    durationSeconds: { type: Number, min: 0, default: 0 },
    watchedAt: { type: Date, default: Date.now }
  }],
  chapterProgress: [{
    mangaId: { type: String, required: true },
    chapterId: { type: String, required: true },
    page: { type: Number, min: 1, default: 1 },
    updatedAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });
schema.index({ 'watchHistory.mediaId': 1, 'watchHistory.watchedAt': -1 });
schema.index({ 'chapterProgress.mangaId': 1, 'chapterProgress.chapterId': 1 });
export default mongoose.model('User', schema);
