import { jest } from "@jest/globals";
import { IDataStorage } from "../../../src/dataStorages/IDataStorage";

export class MongooseDataStorageMock<T> implements IDataStorage<T> {
    find = jest.fn(() => {
        console.log('TodoMongooseModelMock.find()');
        return Promise.resolve<T[]>([])
    })
}