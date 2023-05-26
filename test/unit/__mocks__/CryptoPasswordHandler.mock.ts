import { ICrypterDependency } from "../../../src/utils/cryptPassword//interfaces/ICrypterDependency";

export class CryptoPasswordHandlerMock implements ICrypterDependency{

    generateSalt = jest.fn()

    hashPassword = jest.fn()
    
}