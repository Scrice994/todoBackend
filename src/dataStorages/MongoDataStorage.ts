import mongoose from "mongoose";
import { IEntity } from "src/entities/IEntity";
import { DataStorageId, IDataStorage } from "./IDataStorage";

export class MongoDataStorage<T extends IEntity> implements IDataStorage<T> {
  constructor(private _model: mongoose.Model<any>) {
  }

  async find(): Promise<T[]> {
    return (await this._model.find())
      .map(mongooseRecord => {
        const {__v, _id, ...result} = mongooseRecord.toObject();
        
        return result as T;
      });
  }

  async create(newEntity: T): Promise<T & Required<IEntity>> {
    const newEntityResult = await this._model.create(newEntity);

    console.log('newEntityResult', newEntityResult);
    // const mongoNewEntity = await Promise.resolve((newEntityResult));
    const { _id, __v, ...result} = newEntityResult.toObject();
    return result;
  }

  async update(entity: Required<IEntity> & Partial<T>): Promise<T> {
    const {id, ...toUpdate} = entity;

    const updatedEntity = await this._model.findOneAndUpdate({id}, toUpdate, {new: true});
    // const mongoUpdatedEntity = await Promise.resolve(updatedEntity);
    const { _id, __v, ...result } = updatedEntity.toObject();
    return result;
  }

  async delete(id: DataStorageId ): Promise<T> {
    const deletedEntity = await this._model.findOneAndDelete({id});
    // const mongoDeletedEntity = await Promise.resolve(deletedEntity);
    const { _id, __v, ...result } = deletedEntity.toObject();
    return result;
  }
}
