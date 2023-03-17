import { Schema, InferSchemaType, model } from 'mongoose';
import * as uuid from 'uuid';

const userSchema = new Schema({
    username: { type: String, require: true },
    password: { type: String, require: true },
    salt: { type: String, require: true },
    id: { default: uuid.v4, type: String },
});

type User = InferSchemaType<typeof userSchema>;

export const User = model<User>('User', userSchema);
