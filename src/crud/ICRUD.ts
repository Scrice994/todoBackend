import { DataStorageId } from "src/dataStorages/IDataStorage";
import { IEntity } from "src/entities/IEntity";

interface ICRUDBaseResponse {
    statusCode: number;
    data: {[key:string]: any}
}

export interface ICrudErrorResponse extends ICRUDBaseResponse {
    data: {
        message: string
    }
}

export interface ICRUDSuccessResponse<T> extends ICRUDBaseResponse {
    data: {
        response: T
    }
}

export type ICRUDResponse<T> = ICRUDSuccessResponse<T> | ICrudErrorResponse;

export interface ICRUD<T extends IEntity>{
    read(): Promise<ICRUDResponse<T[]>>;
    create(newElement: Omit<T, 'id'>): Promise<ICRUDResponse<T>>;
    update(updateElement: Required<IEntity> & Partial<T>): Promise<ICRUDResponse<T>>;
    delete(id: DataStorageId): Promise<ICRUDResponse<T>>;
}
