import { IRepository } from "src/repositories/IRepository";
import { ICRUD } from "./ICRUD";
import { TodoEntity } from "src/entities/TodoEntity";

export class TodoCRUD implements ICRUD {
    constructor(
        private repository: IRepository<TodoEntity>
    ) {
    }

    async read(): Promise<any> {
        return this.repository.getAll();
        // todo read from a repository
    }
    create(text: string): any {
        return this.repository.insertOne(text);
    }
    // update(id: string | number, newValue: Partial<TodoEntity>): any{
    //     return this.repository.updateOne(id, newValue)
    // }
    // delete(id: string | number): any {
    //     return this.repository.deleteOne(id)
    // }
}