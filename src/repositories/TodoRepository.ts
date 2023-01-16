import { TodoEntity } from "../entities/TodoEntity";
import { IRepository } from "./IRepository";
import { DataStorageId, IDataStorage } from '../dataStorages/IDataStorage';
import { IEntity } from "src/entities/IEntity";


export class TodoRepository implements IRepository<TodoEntity>{

    constructor(private dataStorage: IDataStorage<TodoEntity>) {}

    async getAll(): Promise<TodoEntity[]> {
        const result = await this.dataStorage.find()
        console.log(result)
        return result
    }

    async insertOne(newTodo: TodoEntity): Promise<TodoEntity> {
        return await this.dataStorage.create(newTodo)
    }

    async updateOne(updateTodo: Required<IEntity> & Partial<TodoRepository>): Promise<TodoEntity> {
        return await this.dataStorage.update(updateTodo)
    }

    async deleteOne(id: DataStorageId ): Promise<TodoEntity> {
        return await this.dataStorage.delete(id)
    }
}
