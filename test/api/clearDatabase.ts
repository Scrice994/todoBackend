import { MongoClient } from "mongodb";

export const clearDatabase = async () => {
    const client = new MongoClient('mongodb://localhost:27017');
    const dbName = 'todoList';
    const db = client.db(dbName);
    const collection = db.collection('todos');
    await collection.deleteMany({})
};
