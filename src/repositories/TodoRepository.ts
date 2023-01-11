import { TodoEntity } from "../entities/TodoEntity";
import { IRepository } from "./IRepository";
import { IDataStorage } from '../dataStorages/IDataStorage';


export class TodoRepository implements IRepository<TodoEntity>{

    constructor(private dataStorage: IDataStorage<TodoEntity>) {}

    async getAll(): Promise<TodoEntity[]> {
        const result = await this.dataStorage.find()
        console.log(result)
        return result
    }

    async insertOne(newTodo: string): Promise<TodoEntity> {
        return await this.dataStorage.create(newTodo)
    }

    async updateOne(id: string | number, newValue: boolean): Promise<TodoEntity> {
        return await this.dataStorage.update(id, newValue)
    }

    async deleteOne(id: string | number): Promise<TodoEntity> {
        return await this.dataStorage.delete(id)
    }
}
