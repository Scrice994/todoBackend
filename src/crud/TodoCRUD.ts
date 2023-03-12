import { IRepository } from 'src/repositories/IRepository';
import { ICRUD } from './ICRUD';
import { TodoEntity } from 'src/entities/TodoEntity';
import { IEntity } from 'src/entities/IEntity';
import { DataStorageId } from 'src/dataStorages/IDataStorage';
import { ICRUDResponse } from './ICRUD';

export class TodoCRUD implements ICRUD<TodoEntity> {
    constructor(private repository: IRepository<TodoEntity>) {}

    async read(): Promise<ICRUDResponse<TodoEntity[]>> {
        try {
            const todos = await this.repository.getAll();

            return {
                statusCode: 200,
                data: {
                    response: todos,
                },
            };
        } catch (error) {
            return this.unknownErrorResponse();
        }
    }

    async create(
        newTodo: Omit<TodoEntity, 'id'>
    ): Promise<ICRUDResponse<TodoEntity>> {
        try {
            if (!newTodo.text) {
                return {
                    statusCode: 400,
                    data: {
                        message: 'Missing required @parameter text',
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
        } catch (error) {
            return this.unknownErrorResponse();
        }
    }

    async update(
        updateTodo: Required<IEntity> & Partial<TodoEntity>
    ): Promise<ICRUDResponse<TodoEntity>> {
        try {
            if (!updateTodo.id) {
                return {
                    statusCode: 404,
                    data: {
                        message: 'Missing or invalid required @parameter id',
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
        } catch (error) {
            return this.unknownErrorResponse();
        }
    }

    async delete(id: DataStorageId): Promise<ICRUDResponse<TodoEntity>> {
        try {
            if (!id) {
                return {
                    statusCode: 404,
                    data: {
                        message: 'Missing or invalid required @parameter id',
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
        } catch (error) {
            return this.unknownErrorResponse();
        }
    }

    async deleteAll(): Promise<ICRUDResponse<number>> {
        try {
            const result = await this.repository.deleteAllTodos();
            
            return {
                statusCode:200,
                data: {
                    response: result
                }
            }
        } catch (error) {
            return this.unknownErrorResponse()
        }
    }

    private unknownErrorResponse() {
        return {
            statusCode: 500,
            data: {
                message: 'Unknown Error',
            },
        };
    }
}
