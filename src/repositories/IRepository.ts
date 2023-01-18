import { DataStorageId } from "src/dataStorages/IDataStorage";
import { IEntity } from "src/entities/IEntity";

export interface IRepository<T extends IEntity> {
    getAll(): Promise<Required<T[]>>;
    insertOne(newEntity: T): Promise<Required<T>>;
    updateOne(updateEntity: Required<IEntity> & Partial<T>): Promise<Required<T>>;
    deleteOne(id: Required<IEntity> ): Promise<Required<T>>;
}