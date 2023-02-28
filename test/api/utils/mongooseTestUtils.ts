import mongoose from "mongoose";
import { Todo } from "../../../src/entities/mongo/mongoSchema";
import { TodoEntity } from "../../../src/entities/TodoEntity"

export const databaseConnection = async () => {
  await mongoose.connect("mongodb://localhost:27017/todoList");
};

export const clearDatabase = async () => {

  const database = mongoose.connection.db;

  const findCollection = await database.listCollections().toArray();
  
  findCollection.map(col => col.name).forEach(async colName => await database.dropCollection(colName))
}

export const clearCollection = async () => {
  await mongoose.connection.db.dropCollection('todos');
}


export const initializeData = async (array: TodoEntity[]) => {
  await Todo.insertMany(array);
};

export const closeDatabaseConnection = async () => {
  await mongoose.connection.close();
}
