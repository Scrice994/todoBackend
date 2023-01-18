import { IEntity } from "src/entities/IEntity";

export type DataStorageId = string;

export interface IDataStorage<T extends IEntity> {
    find(): Promise<Required<T[]>>;
    create(entity: T): Promise<Required<T>>;
    update(entity: Required<IEntity> & Partial<T>): Promise<Required<T>>;
    delete(id: Required<IEntity>): Promise<Required<T>>;
}