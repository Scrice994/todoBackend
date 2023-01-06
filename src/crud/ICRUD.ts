import { TodoEntity } from "src/entities/TodoEntity";

export interface ICRUD {
    create(text: Partial<TodoEntity>): any;
    read(): any;
    update(id: string | number, newValue: Partial<TodoEntity>): any;
    delete(id: string | number): any;
}