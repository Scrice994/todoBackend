import mongoose from "mongoose";
import { IDataStorage } from "./IDataStorage";

type MongooseEntity = {
  _id: string;
  __v: number;
};

export class MongoDataStorage<T> implements IDataStorage<T> {
  constructor(private _model: mongoose.Model<any>) {
  }

  async find(): Promise<T[]> {
    return (await this._model.find())
      .map(mongooseRecord => {
        console.log('MongoRecord', mongooseRecord, Object.keys(mongooseRecord.toObject()));

        const {__v, _id, ...result} = mongooseRecord.toObject();

        return result as T;
      });
  }

//   async create(): Promise<MongooseEntity<T>> {
//     return this._model.create();
//   }

//   async update(): Promise<MongooseEntity<T> | null> {
//     return this._model.findOneAndDelete();
//   }

//   async delete(): Promise<MongooseEntity<T> | null> {
//     return this._model.findOneAndUpdate();
//   }
}
