import mongoose from "mongoose";
import * as uuid from 'uuid'

const toDoSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  id: {
    type: String,
    default: uuid.v4
  }
});

export const Todo = mongoose.model("Todo", toDoSchema);
