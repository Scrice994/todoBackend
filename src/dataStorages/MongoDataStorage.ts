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

  async create(newEntity: T): Promise<Required<T>> {
    const newEntityResult = await this._model.create(newEntity);

    console.log('newEntityResult', newEntityResult);
    // const mongoNewEntity = await Promise.resolve((newEntityResult));
    const { _id, __v, ...result} = newEntityResult.toObject();
    return result;
  }

  async update(entity: Required<IEntity> & Partial<T>): Promise<Required<T>> {
    const {id, ...toUpdate} = entity;

    const updatedEntity = await this._model.findOneAndUpdate({id}, toUpdate, {new: true});
    const { _id, __v, ...result } = updatedEntity.toObject();
    return result;
  }

  async delete(id: DataStorageId ): Promise<Required<T>> {
    const deletedEntity = await this._model.findOneAndDelete({id});
    const { _id, __v, ...result } = deletedEntity.toObject();
    return result;
  }
}
