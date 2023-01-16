import { IEntity } from "src/entities/IEntity";

export type DataStorageId = string;

export interface IDataStorage<T> {
    find(): Promise<T[]>;
    create(entity: T): Promise<T & Required<IEntity>>;
    update(entity: Required<IEntity> & Partial<T>): Promise<T>;
    delete(id: DataStorageId): Promise<T>;
}