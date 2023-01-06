import { TodoEntity } from "src/entities/TodoEntity";

export interface IRepository<T> {
    getAll(): Promise<any>;
    // insertOne(text: Partial<TodoEntity>): Promise<T>;
    // updateOne(id: string | number, todo: Partial<TodoEntity>): Promise<any>;
    // deleteOne(id: string | number): Promise<any>;
}