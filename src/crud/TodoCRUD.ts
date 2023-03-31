import { IRepository } from 'src/repositories/IRepository';
import { ICRUD } from './ICRUD';
import { TodoEntity } from 'src/entities/TodoEntity';
import { IEntity } from 'src/entities/IEntity';
import { DataStorageId } from 'src/dataStorages/IDataStorage';
import { ICRUDResponse } from './ICRUD';

export class TodoCRUD implements ICRUD<TodoEntity> {
    constructor(private repository: IRepository<TodoEntity>) {}

    async read(obj: { [key: string]: unknown }): Promise<ICRUDResponse<TodoEntity[]>> {
        try {
            if(!obj){
                return {
                    statusCode: 404,
                    data: {
                        message: 'Missing required @parameter filter obj',
                    }
                }
            }

            const todos = await this.repository.getAll(obj);

            return {
                statusCode: 200,
                data: {
                    response: todos,
                },
            };

        } catch (error) {
            return this.errorResponse(error);
        }
    }

    readOne(): Promise<ICRUDResponse<TodoEntity>> {
        throw new Error('Method not implemented.');
    }

    async create(newTodo: Omit<TodoEntity, 'id'>): Promise<ICRUDResponse<TodoEntity>> {
        try {
            if (!newTodo.text || newTodo.text === '') {
                return {
                    statusCode: 404,
                    data: {
                        message: 'Missing required @parameter text',
                    },
                };
            }

            if (!newTodo.userId) {
                return {
                    statusCode: 404,
                    data: {
                        message: 'Missing required @parameter userId',
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
            return this.errorResponse(error);
        }
    }

    async update(updateTodo: Required<IEntity> & Partial<TodoEntity>): Promise<ICRUDResponse<TodoEntity>> {
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
            return this.errorResponse(error);
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
                return this.errorResponse(error);
        }
    }

    async deleteAll(obj: {[key: string]: unknown}): Promise<ICRUDResponse<number>> {
        try {
            if(!obj){
                return {
                    statusCode: 404,
                    data: {
                        message: 'Missing required @parameter filter obj',
                    }
                }
            }

            const result = await this.repository.deleteAll(obj);
            
            return {
                statusCode:200,
                data: {
                    response: result
                }
            }
        } catch (error) {
            return this.errorResponse(error);
        }
    }

    private errorResponse(error: any) {
        if (error instanceof Error){
            return {
                statusCode: 500,
                data: {
                    message: error.message,
                },
            };
        } else {
            return {
                statusCode: 500,
                data: {
                    message: "An unknown error occured"
                }
            }    
        }

    }
}
