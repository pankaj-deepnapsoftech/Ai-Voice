import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';

const UserSchema = new Schema(
  {
    organization: { type: String },
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    email_verify: { type: Boolean, required: true, default: false },
    refresh_token: { type: String },
  },
  { timestamps: true },
);

UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

UserSchema.pre('findOneAndUpdate', async function (next) {
  if (!this._update.password) {
    return next();
  }
  this._update.password = await bcrypt.hash(this._update.password, 10);
  next();
});

export const UserModel = model('User', UserSchema);
