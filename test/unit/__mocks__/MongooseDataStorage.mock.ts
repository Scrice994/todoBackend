import { DataStorageId, IDataStorage } from "../../../src/dataStorages/IDataStorage";
import { IEntity } from "../../../src/entities/IEntity";

export class MongooseDataStorageMock<T extends IEntity> implements IDataStorage<T> {
    find = jest.fn(async () => {
        return Promise.resolve<T[]>([])
    })

    findById = jest.fn()

    create = jest.fn(async (newEntity: Omit<T, 'id'>): Promise<T> => {
        return Promise.resolve<T>(newEntity as T)
    })

    update = jest.fn(async (newEntity: Required<IEntity> & Partial<T>): Promise<T> => {
        return Promise.resolve<T>(newEntity as T)
    })

    delete = jest.fn(async (id: DataStorageId): Promise<T> => {
        return Promise.resolve<T>(id as unknown as T)
    })

    deleteMany = jest.fn()
}