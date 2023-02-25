import { MongoClient} from "mongodb";
import * as uuid from 'uuid';

export const clearDatabase = async () => {
    const client = new MongoClient('mongodb://localhost:27017');
    const dbName = 'todoList';
    const db = client.db(dbName);
    const collection = db.collection('todos');
    await collection.deleteMany({})
};

export const initDatabase = async (dbInit: any[]) => {
    const client = new MongoClient('mongodb://localhost:27017');
    const dbName = 'todoList';
    const db = client.db(dbName);
    const collection = db.collection('todos');

    await collection.insertMany(
        dbInit.map((dbRecord) => ({
        _id: uuid.v4,
        __v: 1,
        ...dbRecord
        }))
    )
}
