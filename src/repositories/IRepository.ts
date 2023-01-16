import { DataStorageId } from "src/dataStorages/IDataStorage";
import { TodoEntity } from "src/entities/TodoEntity";

export interface IRepository<T> {
    getAll(): Promise<TodoEntity []>;
    insertOne(newTodo: TodoEntity): Promise<TodoEntity>;
    updateOne(updateTodo: Partial<TodoEntity>): Promise<TodoEntity>;
    deleteOne(id: DataStorageId ): Promise<TodoEntity>;
}