import { TodoEntity } from "src/entities/TodoEntity";

export interface IDataStorage<T> {
    find(): Promise<T[]>;
    create(newTodo: string): Promise<any>;
    // update();
    // delete();
}