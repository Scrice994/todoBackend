import { IJWTPkg } from "../../../src/utils/tokenHandler/IJWTPkg";

export class JsonWebTokenPkgMock implements IJWTPkg{

    singToken = jest.fn()

    verifyToken = jest.fn()
    
}