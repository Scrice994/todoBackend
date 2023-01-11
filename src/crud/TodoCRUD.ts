import { IRepository } from "src/repositories/IRepository";
import { ICRUD } from "./ICRUD";
import { TodoEntity } from "src/entities/TodoEntity";

export class TodoCRUD implements ICRUD {
    constructor(
        private repository: IRepository<TodoEntity>
    ) {
    }

    read(): Promise<any> {
        return this.repository.getAll();
        // todo read from a repository
    }
    create(newTodo: string): Promise<any> {
        return this.repository.insertOne(newTodo);
    }
    update(id: string | number, newValue: boolean): Promise<any>{
        return this.repository.updateOne(id, newValue)
    }
    delete(id: string | number): Promise<any> {
        return this.repository.deleteOne(id)
    }
}