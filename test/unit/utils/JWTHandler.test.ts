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
                    it("should call signToken() from constructor class and return TokenObj", async () => {
                        testJsonWebTokenPkg.singToken.mockImplementationOnce(() => ('testToken'))
                    
                        expect(testJWTHandler.issueJWT(fakeUser, 'fakeSecret')).toEqual({
                            token: 'Bearer testToken',
                            expires: '1d'
                        })
                    })
                })

                describe("checKJWT()", () => {
                    it("should call verifyToken() from constructor class and return true", () => {
                        testJsonWebTokenPkg.verifyToken.mockImplementationOnce(() => ('fakeToken'))

                        expect(testJWTHandler.checkJWT('fakeToken', 'fakeSecret')).toBe('fakeToken')
                    })
                })
            })
        })
    })
})