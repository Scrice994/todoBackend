/* eslint-disable @typescript-eslint/no-unused-vars */
import mongoose from "mongoose";
import { IEntity } from "src/entities/IEntity";
import { DataStorageId, IDataStorage } from "./IDataStorage";

export class MongoDataStorage<T extends IEntity> implements IDataStorage<T> {
  constructor(private _model: mongoose.Model<any>) {
  }

  async find(obj: {[key: string]: unknown}): Promise<T[]> {
    return (await this._model.find(obj))
      .map(mongooseRecord => {
        const {__v, _id, ...result} = mongooseRecord.toObject();
        
        return result as T;
      });
  }

  async findOneByKey(obj: {[key: string]: unknown}): Promise<T> {
    const findEntity = await this._model.findOne(obj);
    const { _id, __v, ...result } = findEntity.toObject();

    return result;
  }

  async create(newEntity: Omit<T, 'id'>): Promise<T> {
    const newEntityResult = await this._model.create(newEntity);
    const { _id, __v, ...result} = newEntityResult.toObject();
    return result;
  }

  async update(entity: Required<IEntity> & Partial<T>): Promise<T> {
    const {id, ...toUpdate} = entity;

    const updatedEntity = await this._model.findOneAndUpdate({id}, toUpdate, {new: true});
    const { _id, __v, ...result } = updatedEntity.toObject();
    return result;
  }

  async delete(id: DataStorageId): Promise<T> {
    const deletedEntity = await this._model.findOneAndDelete({id});
    const { _id, __v, ...result } = deletedEntity.toObject();
    return result;
  }

  async deleteMany(obj: {[key: string]: unknown}): Promise<number> {
    const deleteAllElements = await this._model.deleteMany(obj)
    const { deletedCount } = deleteAllElements
    return deletedCount
  }
}
