import mongoose from "mongoose";
import { MongoTodoEntity } from "src/entities/MongoTodoEntity";
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
    // async insertOne(text: Partial<TodoEntity>): Promise<any> {
    //     return await this.dataStorage.create(newTodo)
    // }

    // async updateOne(id: string | number, newValue: Partial<TodoEntity>): Promise<any | null> {
    //     return await this.dataStorage.findAndUpdate({id: id}, {completed: newValue}, {new: true})
    // }

    // async deleteOne(id: string | number): Promise<any | null> {
    //     return await this.dataStorage.findAndDelete({id: id})
    // }
}
