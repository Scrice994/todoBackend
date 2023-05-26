import { IJsonWebTokenPkg } from "../../../src/utils/tokenHandler/JsonWebTokenPkg/IJsonWebTokenPkg";

export class JsonWebTokenPkgMock implements IJsonWebTokenPkg{

    singToken = jest.fn()

    verifyToken = jest.fn()
    
}