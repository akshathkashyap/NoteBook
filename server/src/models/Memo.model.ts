import mongoose, { Document, Schema } from 'mongoose';

export interface MemoDocument extends Document {
  author: mongoose.Types.ObjectId;
  recipients: mongoose.Types.ObjectId[];
  name: string;
  priority: 1 | 2 | 3;
  updatedAt: Date;
  content: string;
}

const memoSchema = new Schema<MemoDocument>({
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  recipients: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  name: { type: String, required: true },
  priority: { type: Number, default: 3, enum: [1, 2, 3] },
  updatedAt: { type: Date, default: Date.now },
  content: { type: String, required: true },
});

const Memo = mongoose.model<MemoDocument>('Memo', memoSchema);

export default Memo;
