import { IRepository } from "src/repositories/IRepository";
import { ICRUD } from "./ICRUD";
import { TodoEntity } from "src/entities/TodoEntity";
import { DataStorageId } from "src/dataStorages/IDataStorage";
import { IEntity } from "src/entities/IEntity";

export class TodoCRUD implements ICRUD {
    constructor(
        private repository: IRepository<TodoEntity>
    ) {
    }

    read(): Promise<TodoEntity []> {
        return this.repository.getAll();
        // todo read from a repository
    }
    create(newObj: TodoEntity): Promise<TodoEntity> {
        return this.repository.insertOne(newObj);
    }
    update(updateObj: Required<IEntity> & Partial<TodoEntity>): Promise<TodoEntity>{
        return this.repository.updateOne(updateObj)
    }
    delete(id: DataStorageId): Promise<TodoEntity> {
        return this.repository.deleteOne(id)
    }
}