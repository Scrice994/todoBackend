import { jest } from "@jest/globals";
import { DataStorageId, IDataStorage } from "../../../src/dataStorages/IDataStorage";
import { IEntity } from "../../../src/entities/IEntity";

export class MongooseDataStorageMock<T extends IEntity> implements IDataStorage<T> {
    find = jest.fn(async () => {
        console.log('TodoMongooseModelMock.find()'); //chiedere a Ruggero!
        return Promise.resolve<Required<T>[]>([])
    })

    
    create = jest.fn(async (newEntity: T): Promise<Required<T>> => {
        return Promise.resolve<Required<T>>({} as Required<T>)
    })

    update = jest.fn(async (newEntity: Required<IEntity> & Partial<T>): Promise<Required<T>> => {
        return Promise.resolve<Required<T>>({} as Required<T>)
    })

    delete = jest.fn(async (id: DataStorageId): Promise<Required<T>> => {
        return Promise.resolve<Required<T>>({} as Required<T>)
    })
}