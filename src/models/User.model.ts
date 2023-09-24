// models/UserModel.ts

import mongoose, { Schema } from "mongoose";
import { IUser } from "../schema/User.schema";

const userSchema: Schema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
});

export const UserModel = mongoose.model<IUser>("User", userSchema);
