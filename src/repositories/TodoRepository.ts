import { TodoEntity } from "../entities/TodoEntity";
import { IRepository } from "./IRepository";
import { DataStorageId, IDataStorage } from '../dataStorages/IDataStorage';
import { IEntity } from "src/entities/IEntity";


export class TodoRepository implements IRepository<TodoEntity>{

    constructor(private dataStorage: IDataStorage<TodoEntity>) {}

    async getAll(): Promise<Required<TodoEntity[]>> {
        const result = await this.dataStorage.find()
        return result
    }

    async insertOne(newTodo: TodoEntity): Promise<Required<TodoEntity>> {
        //Error Handling da fare quando il newTodo è vuoto
        return await this.dataStorage.create(newTodo)
    }

    async updateOne(updateTodo: Required<IEntity> & Partial<TodoEntity>): Promise<Required<TodoEntity>> {
        return await this.dataStorage.update(updateTodo)
    }

    async deleteOne(id: Required<IEntity> ): Promise<Required<TodoEntity>> {
        console.log(id)
        const result = await this.dataStorage.delete(id)
        console.log(result)
        return result
    }
}
