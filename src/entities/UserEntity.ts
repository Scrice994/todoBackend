import { IEntity } from "./IEntity";

export interface UserEntity extends IEntity{
    username: string,
    hash?: string,
    salt?: string,
}