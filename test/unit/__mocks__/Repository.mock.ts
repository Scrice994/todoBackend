import { jest } from "@jest/globals";
import { IRepository } from "../../../src/repositories/IRepository";
import { IEntity } from "../../../src/entities/IEntity";
import { DataStorageId } from "../../../src/dataStorages/IDataStorage";

export class RepositoryMock<T> implements IRepository<T>{
    getAll = jest.fn(() => {
        return Promise.resolve<Required<T[]>>([])
    })

    insertOne = jest.fn(async (newElement: T): Promise<Required<T>> => {
        return Promise.resolve<Required<T>>(newElement as Required<T>)
    })

    updateOne = jest.fn(async (updateElement: Required<IEntity> & Partial<T>): Promise<Required<T>> => {
        return Promise.resolve<Required<T>>(updateElement as Required<T>)
    })

    deleteOne = jest.fn(async (id: DataStorageId): Promise<Required<T>> => {
        return Promise.resolve<Required<T>>(id as unknown as Required<T>)
    })
}