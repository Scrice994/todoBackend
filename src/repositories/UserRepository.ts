import { UserEntity } from "../entities/UserEntity";
import { IRepository } from "./IRepository";
import { DataStorageId, IDataStorage } from '../dataStorages/IDataStorage';
import { IEntity } from "src/entities/IEntity";

export class UserRepository implements IRepository<UserEntity>{
    constructor(private DataStorage: IDataStorage<UserEntity>){}

    async getAll(): Promise<UserEntity[]> {
        throw new Error("Method not implemented.");
    }

    async getOneById(userId: DataStorageId): Promise<UserEntity>{
        const result = await this.DataStorage.findById(userId)
        return result
    }

    async insertOne(newEntity: Omit<UserEntity, "id">): Promise<UserEntity> {
        const result = await this.DataStorage.create(newEntity)
        return result
    }

    async updateOne(updateEntity: Required<IEntity> & Partial<UserEntity>): Promise<UserEntity> {
        throw new Error("Method not implemented.");
    }

    async deleteOne(id: DataStorageId): Promise<UserEntity> {
        throw new Error("Method not implemented.");
    }

    async deleteAll(): Promise<number> {
        throw new Error("Method not implemented.");
    }
}