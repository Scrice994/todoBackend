import { DataStorageId } from "src/dataStorages/IDataStorage";
import { IEntity } from "src/entities/IEntity";

export interface IRepository<T extends IEntity> {
    getAll(): Promise<T[]>;
    getOneById(id: DataStorageId): Promise<T>;
    insertOne(newEntity: Omit<T, 'id'>): Promise<T>;
    updateOne(updateEntity: Required<IEntity> & Partial<T>): Promise<T>;
    deleteOne(id: DataStorageId): Promise<T>;
    deleteAll(): Promise<number>
}