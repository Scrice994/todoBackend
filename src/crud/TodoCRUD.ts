import { IRepository } from "src/repositories/IRepository";
import { ICRUD } from "./ICRUD";
import { TodoEntity } from "src/entities/TodoEntity";
import { IEntity } from "src/entities/IEntity";

export class TodoCRUD implements ICRUD<TodoEntity> {
    constructor(
        private repository: IRepository<TodoEntity>
    ) {
    }

    read(): Promise<Required<TodoEntity[]>> {
        return this.repository.getAll();
        // todo read from a repository
    }
    create(newTodo: TodoEntity): Promise<Required<TodoEntity>> {
        return this.repository.insertOne(newTodo);
    }
    update(updateTodo: Required<IEntity> & Partial<TodoEntity>): Promise<Required<TodoEntity>>{
        return this.repository.updateOne(updateTodo)
    }
    delete(id: Required<IEntity>): Promise<Required<TodoEntity>> {
        return this.repository.deleteOne(id)
    }
}