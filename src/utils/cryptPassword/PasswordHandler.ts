import { ICrypterDependency } from "./ICrypterDependency";
import { IPasswordHandler } from "./IPasswordHandler";
import { IHashPasswordEntity } from "../../entities/IHashPasswordEntity";

export class PasswordHandler implements IPasswordHandler{

    constructor(private crypterDependency: ICrypterDependency){}

    cryptPassword(password: string): IHashPasswordEntity {
        const salt = this.crypterDependency.generateSalt(32);

        const cryptedPassword = this.crypterDependency.hashPassword(password, salt);
        
        return {
            salt: salt,
            hashPassword: cryptedPassword
        };
    }
    
    checkPassword(UIpassword: string, DBpassword: string, salt: string): boolean {
        const result = this.crypterDependency.hashPassword(UIpassword, salt);
        
        return result === DBpassword;
    }
}