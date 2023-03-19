import { IRepository } from 'src/repositories/IRepository';
import { ICRUD } from './ICRUD';
import { UserEntity } from 'src/entities/UserEntity';
import { IEntity } from 'src/entities/IEntity';
import { ICRUDResponse } from './ICRUD';

export class UserCRUD implements ICRUD<UserEntity>{
    constructor(private repository: IRepository<UserEntity>){}
    
    async read(): Promise<ICRUDResponse<UserEntity[]>> {
        throw new Error('Method not implemented.');
    }
    async readOne(obj: {[key: string]: unknown}): Promise<ICRUDResponse<UserEntity>> {
        try {
            const result = await this.repository.getOneByKey(obj)    

            return {
                statusCode: 200,
                data: {
                    response: result
                }
            }
        } catch (error) {
            if(error instanceof Error){
                return this.errorResponse(error)
            }else{
                return this.unknownErrorResponse()
            }
        }
    }
    async create(newElement: Omit<UserEntity, 'id'>): Promise<ICRUDResponse<UserEntity>> {
        try {
            const result = await this.repository.insertOne(newElement)
            
            return {
                statusCode: 200,
                data: {
                    response: result
                }
            }
            
        } catch (error) {
            if(error instanceof Error){
                return this.errorResponse(error)
            }else{
                return this.unknownErrorResponse()
            } 
        }

    }

    async update(updateElement: Required<IEntity> & Partial<UserEntity>): Promise<ICRUDResponse<UserEntity>> {
        throw new Error('Method not implemented.');
    }

    async delete(id: string): Promise<ICRUDResponse<UserEntity>> {
        throw new Error('Method not implemented.');
    }

    async deleteAll(): Promise<ICRUDResponse<number>> {
        throw new Error('Method not implemented.');
    }

    private errorResponse(error: Error) {
        return {
            statusCode: 500,
            data: {
                message: error.message,
            },
        };
    }

    private unknownErrorResponse(){
        return {
            statusCode: 500,
            data: {
                message: "An unknown error occured"
            }
        }
    }
    
}