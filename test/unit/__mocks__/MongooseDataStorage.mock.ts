import { jest } from "@jest/globals";
import { IDataStorage } from "../../../src/dataStorages/IDataStorage";
import { TodoEntity } from "../../../src/entities/TodoEntity";

export class MongooseDataStorageMock<T> implements IDataStorage<T> {
    find = jest.fn(() => {
        console.log('TodoMongooseModelMock.find()'); //chiedere a Ruggero!
        return Promise.resolve<T[]>([])
    })

    create = jest.fn((newTodo: string) => {
        return Promise.resolve<TodoEntity>({text: newTodo, completed: false, id: 'mockId'})
    })

    update(id: string | number, newValue: any): Promise<any> {
        return Promise.resolve({text: "mockText", id: id, completed: newValue})
    }
}