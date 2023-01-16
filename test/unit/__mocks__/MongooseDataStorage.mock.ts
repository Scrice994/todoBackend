import { jest } from "@jest/globals";
import { DataStorageId, IDataStorage } from "../../../src/dataStorages/IDataStorage";

export class MongooseDataStorageMock<T> implements IDataStorage<T> {
    find = jest.fn(() => {
        console.log('TodoMongooseModelMock.find()'); //chiedere a Ruggero!
        return Promise.resolve<T[]>([])
    })

    
    create = jest.fn(async (newEntity: T) => {
        return Promise.resolve<T>(newEntity)
    })

    update = jest.fn(async (newEntity: T): Promise<any> => {
        return Promise.resolve(newEntity)
    })

    delete = (id: DataStorageId): Promise<any> => {
        return Promise.resolve({id})
    }
}