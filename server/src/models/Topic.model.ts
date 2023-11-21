import mongoose, { Document, Schema } from 'mongoose';

export interface TopicDocument extends Document {
  author: mongoose.Types.ObjectId;
  pages: mongoose.Types.ObjectId[];
  name: string;
}

const topicSchema = new Schema<TopicDocument>({
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  pages: [{ type: Schema.Types.ObjectId, ref: 'Page' }],
  name: { type: String, required: true },
});

const Topic = mongoose.model<TopicDocument>('Topic', topicSchema);

export default Topic;
