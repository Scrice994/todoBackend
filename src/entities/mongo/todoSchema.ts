import { Schema, model, InferSchemaType } from 'mongoose';
import * as uuid from 'uuid';

const todoSchema = new Schema({
    text: { type: String, required: true },
    completed: { type: Boolean, default: false },
    userId: { type: String, require: true },
    id: { type: String, default: uuid.v4 },
});

type Todo = InferSchemaType<typeof todoSchema>

export const Todo = model<Todo>('Todo', todoSchema);
