import { IRepository } from "../../../src/repositories/IRepository";
import { IEntity } from "../../../src/entities/IEntity";
import { DataStorageId } from "../../../src/dataStorages/IDataStorage";

export class RepositoryMock<T extends IEntity> implements IRepository<T>{
    getAll = jest.fn(() => {
        return Promise.resolve<T[]>([])
    })

    insertOne = jest.fn(async (newElement: Omit<T, 'id'>): Promise<T> => {
        return Promise.resolve<T>(newElement as T)
    })

    updateOne = jest.fn(async (updateElement: Required<IEntity> & Partial<T>): Promise<T> => {
        return Promise.resolve<T>(updateElement as T)
    })

    deleteOne = jest.fn(async (id: DataStorageId): Promise<T> => {
        return Promise.resolve<T>(id as unknown as T)
    })

    deleteAllTodos = jest.fn()
}