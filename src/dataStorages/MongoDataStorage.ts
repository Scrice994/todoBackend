import mongoose from "mongoose";
import { TodoEntity } from "src/entities/TodoEntity";
import { IDataStorage } from "./IDataStorage";

export class MongoDataStorage<T> implements IDataStorage<T> {
  constructor(private _model: mongoose.Model<any>) {
  }

  async find(): Promise<T[]> {
    return (await this._model.find())
      .map(mongooseRecord => {
        const {__v, _id, ...result} = mongooseRecord.toObject();
        
        return result as T;
      });
  }

  async create(newTodo: string): Promise<TodoEntity> {
    const createNewTodo = await this._model.create({text: newTodo});
    const mongoNewTodo = await Promise.resolve((createNewTodo));
    const { _id, __v, ...result} = mongoNewTodo.toObject();
    return result;
  }

  async update(id: string | number, newValue: boolean): Promise<TodoEntity> {
    const updatedTodo = await this._model.findOneAndUpdate({id: id}, {completed: newValue}, {new: true});
    const mongoUpdatedTodo = await Promise.resolve(updatedTodo);
    const { _id, __v, ...result } = mongoUpdatedTodo.toObject();
    return result;
  }

  async delete(id: string | number): Promise<TodoEntity> {
    const deletedTodo = await this._model.findOneAndDelete({id: id});
    const mongoDeletedTodo = await Promise.resolve(deletedTodo);
    const { _id, __v, ...result } = mongoDeletedTodo.toObject();
    return result;
  }
}
