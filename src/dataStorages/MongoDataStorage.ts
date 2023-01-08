import mongoose from "mongoose";
import { TodoEntity } from "src/entities/TodoEntity";
import { IDataStorage } from "./IDataStorage";

interface MongooseEntity{
  _id: string
  __v: number
};

export class MongoDataStorage<T> implements IDataStorage<T> {
  constructor(private _model: mongoose.Model<any>) {
  }

  async find(): Promise<T[]> {
    return (await this._model.find())
      .map(mongooseRecord => {
        //console.log('MongoRecord', mongooseRecord, Object.keys(mongooseRecord.toObject()));

        const {__v, _id, ...result} = mongooseRecord.toObject();
        
        return result as T;
      });
  }

  async create(newTodo: string): Promise<TodoEntity> {
    const createNewTodo = await this._model.create({text: newTodo});
    const mongoNewTodo = await Promise.resolve((createNewTodo));
    const { _id, __v, ...result} = mongoNewTodo.toObject()
    return result;
  }

//   async update(): Promise<MongooseEntity<T> | null> {
//     return this._model.findOneAndDelete();
//   }

//   async delete(): Promise<MongooseEntity<T> | null> {
//     return this._model.findOneAndUpdate();
//   }
}
