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

    async insertOne(newTodo: TodoEntity): Promise<Required<TodoEntity> | Error> {
        try{
            if (newTodo.text != ""){
                const result = await this.dataStorage.create(newTodo)
                return result
            } else {
                throw new Error("Todo text can't be empty")
            }
        } catch(error) {
            if(error instanceof Error){
                console.log(error.message)
            }
            throw new Error("Todo text can't be empty")
        }
    }

    async updateOne(updateTodo: Required<IEntity> & Partial<TodoEntity>): Promise<Required<TodoEntity>> {
        return await this.dataStorage.update(updateTodo)
    }

    async deleteOne(id: Required<IEntity> ): Promise<Required<TodoEntity>> {
        const result = await this.dataStorage.delete(id)
        return result
    }
}
