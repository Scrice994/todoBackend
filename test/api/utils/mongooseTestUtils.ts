import mongoose from "mongoose";

export const databaseConnection = async () => {
  await mongoose.connect("mongodb://localhost:27017/todoList");
};

export const clearDatabase = async () => {

  const database = mongoose.connection.db;

  const findCollection = await database.listCollections().toArray();
  
  findCollection.map(col => col.name).forEach(async colName => await database.dropCollection(colName))
}

export const clearCollection = async (colName: string) => {
  await mongoose.connection.db.dropCollection(colName);
}


export const initializeData = async (array: any[], model: mongoose.Model<any>) => {
  await model.insertMany(array);
};

export const closeDatabaseConnection = async () => {
  await mongoose.connection.close();
}
