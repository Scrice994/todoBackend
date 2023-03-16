import { IEntity } from "../entities/IEntity";

export type DataStorageId = string;

export interface IDataStorage<T extends IEntity> {
    find(): Promise<T[]>;
    findById(id: DataStorageId): Promise<T>;
    create(entity: Omit<T, 'id'>): Promise<T>;
    update(entity: Required<IEntity> & Partial<T>): Promise<T>;
    delete(id: DataStorageId): Promise<T>;
    deleteMany(): Promise<number>
}