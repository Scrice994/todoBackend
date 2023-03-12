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

    async insertOne(newTodo: Omit<TodoEntity, 'id'>): Promise<TodoEntity> {
        const result = await this.dataStorage.create(newTodo)
        return result

    }

    async updateOne(updateTodo: Required<IEntity> & Partial<TodoEntity>): Promise<TodoEntity> {
        const result =  await this.dataStorage.update(updateTodo)
        return result
    }

    async deleteOne(id: DataStorageId ): Promise<TodoEntity> {
        const result = await this.dataStorage.delete(id)
        return result
    }

    async deleteAllTodos(): Promise<number> {
        const result = await this.dataStorage.deleteMany()
        return result
    }
}
