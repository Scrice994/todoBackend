import mongoose from "mongoose";
import { MongoTodoEntity } from "src/entities/MongoTodoEntity";
import { TodoEntity } from "../entities/TodoEntity";
import { IRepository } from "./IRepository";


export class TodoRepository implements IRepository<TodoEntity>{

    constructor(private model: mongoose.Model<any>) {}

    async getAll(): Promise<MongoTodoEntity[]> {
        return await this.model.find();
    }
    async insertOne(text: Partial<TodoEntity>): Promise<MongoTodoEntity> {
        const newTodo = new this.model({text})
        return await this.model.create(newTodo)
    }

    async updateOne(id: string | number, newValue: Partial<TodoEntity>): Promise<MongoTodoEntity | null> {
        return await this.model.findOneAndUpdate({id: id}, {completed: newValue}, {new: true})
    }

    async deleteOne(id: string | number): Promise<MongoTodoEntity | null> {
        return await this.model.findOneAndDelete({id: id})
    }
}
