import mongoose, { Document, Schema } from 'mongoose';

export interface UserPreferences {
  theme: string;
}

export interface UserDocument extends Document {
  username: string;
  email: string;
  password: string;
  preferences: UserPreferences;
}

export interface UserData {
  userId: string;
  username: string;
  email: string;
  password?: string;
  preferences?: UserPreferences;
}

export const ValidUserQueryParams = [
  'userId',
  'username',
  'email'
];

export const ValidUserUpdateParams = [
  'username',
  'email',
  'password',
  'preferences'
];

const userSchema = new Schema<UserDocument>({
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  preferences: {
    theme: { type: String, default: 'light' }, // Set a default theme or adjust as needed
  },
});

const User = mongoose.model<UserDocument>('User', userSchema);

export default User;
