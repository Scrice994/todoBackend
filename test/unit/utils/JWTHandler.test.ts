import { JsonWebTokenPkgMock } from "../__mocks__/JsonWebTokenPkg.mock"
import { JWTHandler } from '../../../src/utils/tokenHandler/JWTHandler'

describe("unit", () => {
    describe("utils", () => {
        describe("tokenHandler", () => {
            describe("JWTHandler", () => {
                const testJsonWebTokenPkg = new JsonWebTokenPkgMock();
                const testJWTHandler = new JWTHandler(testJsonWebTokenPkg);
                const fakeUser = {
                    username: "fakeUser",
                    password: "fakePassword",
                    salt: "fakeSalt",
                    id: "fakeId"
                }

                describe("issueJWT()",() => {
                    it("should call callSignedToken() from JsonWebToken class dependency", async () => {
                        testJsonWebTokenPkg.singToken.mockImplementationOnce(() => ('testToken'))
                    
                        expect(testJWTHandler.issueJWT(fakeUser)).toEqual({
                            token: 'Bearer testToken',
                            expires: '1d'
                        })
                    })
                })
            })
        })
    })
})