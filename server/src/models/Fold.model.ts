import mongoose, { Document, Schema } from 'mongoose';

export interface FoldDocument extends Document {
  author: mongoose.Types.ObjectId; // Reference to User
  page: mongoose.Types.ObjectId; // Reference to Page
  content: string; // HTML file source
}

const foldSchema = new Schema<FoldDocument>({
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  page: { type: Schema.Types.ObjectId, ref: 'Page', required: true },
  content: { type: String, required: true },
});

const Fold = mongoose.model<FoldDocument>('Fold', foldSchema);

export default Fold;
