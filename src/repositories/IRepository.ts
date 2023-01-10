import { TodoEntity } from "src/entities/TodoEntity";

export interface IRepository<T> {
    getAll(): Promise<T[]>;
    insertOne(newTodo: string): Promise<T>;
    updateOne(id: string | number, todo: boolean): Promise<T>;
    // deleteOne(id: string | number): Promise<any>;
}