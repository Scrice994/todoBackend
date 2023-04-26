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
                return this.customErrorResponse(404, 'Missing required @parameter filter obj')
            }

            const todos = await this.repository.getAll(obj);
            return this.successfullResponse(todos)

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
                return this.customErrorResponse(404, 'Missing required @parameter text')
            }

            if (!newTodo.userId) {
                return this.customErrorResponse(404, 'Missing required @parameter userId')
            }

            const result = await this.repository.insertOne(newTodo);
            return this.successfullResponse(result)

        } catch (error) {
            return this.errorResponse(error);
        }
    }

    async update(updateTodo: Required<IEntity> & Partial<TodoEntity>): Promise<ICRUDResponse<TodoEntity>> {
        try {
            if (!updateTodo.id) {
                return this.customErrorResponse(404, 'Missing or invalid required @parameter id')
            }

            const result = await this.repository.updateOne(updateTodo);
            return this.successfullResponse(result)

        } catch (error) {
            return this.errorResponse(error);
        }
    }

    async delete(id: DataStorageId): Promise<ICRUDResponse<TodoEntity>> {
        try {
            if (!id) {
                return this.customErrorResponse(404, 'Missing or invalid required @parameter id')
            }

            const result = await this.repository.deleteOne(id);
            return this.successfullResponse(result)

        } catch (error) {
                return this.errorResponse(error);
        }
    }

    async deleteAll(obj: {[key: string]: unknown}): Promise<ICRUDResponse<number>> {
        try {
            if(!obj){
                return this.customErrorResponse(404, 'Missing required @parameter filter obj')
            }

            const result = await this.repository.deleteAll(obj);
            return this.successfullResponse(result)

        } catch (error) {
            return this.errorResponse(error);
        }
    }

    private successfullResponse(result: any){
        return {
             statusCode: 200,
             data: {
                response: result
            }
        }
    }

    private customErrorResponse(statusCode: number, customErrorMessage: string){
        return {
            statusCode: statusCode,
            data: {
                message: customErrorMessage,
            }
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
