import { IRepository } from '../repositories/IRepository';
import { ICRUD } from './ICRUD';
import { UserEntity } from '../entities/UserEntity';
import { IEntity } from '../entities/IEntity';
import { ICRUDResponse } from './ICRUD';
import { ValidCredentials } from '../utils/verifyCredentials/ValidCredentials';
import { CryptoPasswordHandler } from '../utils/cryptPassword/CryptoPasswordHandler';
import { PasswordHandler } from '../utils/cryptPassword/PasswordHandler';

export class UserCRUD implements ICRUD<UserEntity>{
    constructor(private repository: IRepository<UserEntity>){}
    
    async read(): Promise<ICRUDResponse<UserEntity[]>> {
        throw new Error('Method not implemented.');
    }

    async readOne(obj: {[key: string]: unknown}): Promise<ICRUDResponse<UserEntity>> {
        try {
            const result = await this.repository.getOneByKey(obj)    
            return this.successfullResponse(result)
        } catch (error) {
            return this.errorResponse(error)
        }
    }

    async create(newElement: Omit<UserEntity, 'id' | 'salt'>): Promise<ICRUDResponse<UserEntity>> {
        try {
            if(!newElement.username){
                return this.customErrorResponse(404, 'Missing required @parameter username')
            }
            if(!newElement.password){
                return this.customErrorResponse(404, 'Missing required @parameter password')
            }

            const credentials = new ValidCredentials(newElement.username, newElement.password);

            if(!credentials.usernameCheck()){
                return this.customErrorResponse(404, 'Invalid @parameter username')
            }
            if(!credentials.passwordCheck()){
                return this.customErrorResponse(404, 'Invalid @parameter password')
            }

            const hashPasswordSalt = new PasswordHandler(new CryptoPasswordHandler()).cryptPassword(newElement.password)

            const result = await this.repository.insertOne({ ...newElement, ...hashPasswordSalt })
            return this.successfullResponse(result)  
        } catch (error) {
            return this.errorResponse(error)
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