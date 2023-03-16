import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { Todo } from "../../../src/entities/mongo/todoSchema";

let mongo: MongoMemoryServer | null = null;

export const connectFakeDB = async () => {
    mongoose.set('strictQuery', true);
    mongo = await MongoMemoryServer.create();
    const uri = mongo.getUri();
    await mongoose.connect(uri);

}

export const dropFakeDB = async () => {
    if(mongo) {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
        await mongo.stop();
    }
}

export const dropFakeCollections = async () => {
    Todo.collection.drop()
}
