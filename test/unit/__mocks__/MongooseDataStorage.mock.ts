import { jest } from "@jest/globals";
import { IDataStorage } from "../../../src/dataStorages/IDataStorage";
import { IEntity } from "../../../src/entities/IEntity";

export class MongooseDataStorageMock<T extends IEntity> implements IDataStorage<T> {
    find = jest.fn(async () => {
        return Promise.resolve<Required<T[]>>([])
    })

    
    create = jest.fn(async (newEntity: T): Promise<Required<T>> => {
        return Promise.resolve<Required<T>>(newEntity as Required<T>)
    })

    update = jest.fn(async (newEntity: Required<IEntity> & Partial<T>): Promise<Required<T>> => {
        return Promise.resolve<Required<T>>(newEntity as Required<T>)
    })

    delete = jest.fn(async (id: Required<IEntity>): Promise<Required<T>> => {
        return Promise.resolve<Required<T>>(id as unknown as Required<T>)
    })
}