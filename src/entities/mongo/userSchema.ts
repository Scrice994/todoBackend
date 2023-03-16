import { Schema, InferSchemaType, model } from 'mongoose';
import * as uuid from 'uuid';

const userSchema = new Schema({
    username: { type: String, require: true },
    hash: { type: String },
    salt: { type: String },
    id: { default: uuid.v4, type: String },
});

type User = InferSchemaType<typeof userSchema>;

export const User = model<User>('User', userSchema);
