import mongoose from "mongoose";
import { Todo } from "../../../src/entities/mongo/todoSchema";

export const databaseConnection = async () => {
  mongoose.set('strictQuery', false)
  await mongoose.connect("mongodb://localhost:27017/todoList");
};

export const clearDatabase = async () => {

  const database = mongoose.connection.db;

  const findCollection = await database.listCollections().toArray();
  
  findCollection.map(col => col.name).forEach(async colName => await database.dropCollection(colName))
}

// export const clearCollection = async (colName: string) => {
//   const database = mongoose.connection.db;
//   const findCollection = await database.listCollections().toArray();
//   const collection = findCollection.find(col => col.name === colName)
//   if(collection){
//     await mongoose.connection.db.dropCollection(colName);
//   }
// }

export const clearDB = async () => {
  await mongoose.connection.dropDatabase()
}


export const initializeData = async (array: any[], model: mongoose.Model<any>) => {
  await model.insertMany(array);
};

export const initializeTodoData = async (userId: string) => {
  const dbInit = [
    {
      id: "1",
      text: "fakeText1",
      completed: false,
      userId: userId
    },
    {
      id: "2",
      text: "fakeText2",
      completed: true,
      userId: userId
    },
  ];
  
  await Todo.insertMany(dbInit);
};

export const closeDatabaseConnection = async () => {
  await mongoose.connection.close();
}
