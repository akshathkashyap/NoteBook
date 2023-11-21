import mongoose, { Document, Schema } from 'mongoose';

export interface PagePermissions {
  read: mongoose.Types.ObjectId[]; // Reference to User
  write: mongoose.Types.ObjectId[]; // Reference to User
}

export interface PageDocument extends Document {
  author: mongoose.Types.ObjectId; // Reference to User
  folds: mongoose.Types.ObjectId[]; // Reference to Fold
  permissions: PagePermissions;
  name: string;
  content: string; // HTML file source
}

const pageSchema = new Schema<PageDocument>({
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  folds: [{ type: Schema.Types.ObjectId, ref: 'Fold' }],
  permissions: {
    read: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    write: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  name: { type: String, required: true }, // Use Mixed type for string or number
  content: { type: String, required: true },
});

const Page = mongoose.model<PageDocument>('Page', pageSchema);

export default Page;
