import { PasswordHandler } from '../../../src/utils/cryptPassword/PasswordHandler'
import { CryptoPasswordHandlerMock } from '../__mocks__/CryptoPasswordHandler.mock'

describe("unit", () => {
    describe("utils", () => {
        describe("PasswordHandler", () => {
            const testCryptoPasswordHandler = new CryptoPasswordHandlerMock()
            const testPasswordHandler = new PasswordHandler(testCryptoPasswordHandler)

            describe("cryptPassword()", () => {
                it("Should call methods from the given class dependency and return correct obj",async () => {
                    testCryptoPasswordHandler.generateSalt.mockImplementationOnce(() => ('fakeSalt'))
                    testCryptoPasswordHandler.hashPassword.mockImplementationOnce(() => ('fakeHash'))

                    expect(testPasswordHandler.cryptPassword('testPassword')).toEqual({
                        salt: 'fakeSalt',
                        password: 'fakeHash'
                    })
                })
            })

            describe("checkPassword()", () => {
                it("should call hashPassword() form class dependency and compare with the given DBpassword", () => {
                    testCryptoPasswordHandler.hashPassword.mockImplementationOnce(() => ('fakeHash'))

                    expect(testPasswordHandler.checkPassword('fakePassword','fakeHash','fakeSalt')).toBe(true)
                })
            })
        })
    })
})