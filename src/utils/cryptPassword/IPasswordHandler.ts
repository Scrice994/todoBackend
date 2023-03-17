import { IHashPasswordEntity } from "../../entities/IHashPasswordEntity"

export interface IPasswordHandler{
    cryptPassword(password: string): IHashPasswordEntity 
    checkPassword(UIpassword: string, DBpassword: string, salt: string): boolean
}