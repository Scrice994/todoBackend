import { IRepository } from "src/repositories/IRepository";
import { ICRUD } from "./ICRUD";
import { TodoEntity } from "src/entities/TodoEntity";
import { IEntity } from "src/entities/IEntity";
import { DataStorageId } from "src/dataStorages/IDataStorage";
import { ICRUDResponse } from "./ICRUD";

export class TodoCRUD implements ICRUD<TodoEntity> {
  constructor(private repository: IRepository<TodoEntity>) {}

  async read(): Promise<ICRUDResponse<TodoEntity[]>> {
    const todos = await this.repository.getAll();

    return {
      statusCode: 200,
      data: {
        response: todos,
      },
    };
  }

  async create(
    newTodo: Omit<TodoEntity, "id">
  ): Promise<ICRUDResponse<TodoEntity>> {
    if (!newTodo.text) {
      return {
        statusCode: 400,
        data: {
          message: "Missing required @parameter text",
        },
      };
    }

    const result = await this.repository.insertOne(newTodo);

    return {
      statusCode: 200,
      data: {
        response: result,
      },
    };
  }

  async update(
    updateTodo: Required<IEntity> & Partial<TodoEntity>
  ): Promise<ICRUDResponse<TodoEntity>> {
    if (!updateTodo.id) {
      return {
        statusCode: 404,
        data: {
          message: "Missing or invalid required @parameter id",
        },
      };
    }

    const result = await this.repository.updateOne(updateTodo);

    return {
      statusCode: 200,
      data: {
        response: result,
      },
    };
  }

  async delete(id: DataStorageId): Promise<ICRUDResponse<TodoEntity>> {
    if (!id) {
      return {
        statusCode: 404,
        data: {
          message: "Missing or invalid required @parameter id",
        },
      };
    }

    const result = await this.repository.deleteOne(id);

    return {
      statusCode: 200,
      data: {
        response: result,
      },
    };
  }
}
