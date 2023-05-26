import { ValidCredentials } from '../../../src/utils/verifyCredentials/ValidCredentials'

describe("unit", () => {
    describe("utils", () => {
        describe("ValidCredentials", () => {
            describe("usernameCheck()", () => {
                it("Should return true if username is valid", () => {
                    const credentials = new ValidCredentials('AndreaLegrenzi95', '')

                    const username = credentials.usernameCheck()

                    expect(username).toBe(true)
                })

                it("Should return error object if username contain invalid chars", () => {
                    const credentials = new ValidCredentials('$Andrea%Legre/nzi', '')

                    const username = credentials.usernameCheck()

                    expect(username).toBe(false)
                })

                it("Should return error object if username is not long enough", () => {
                    const credentials = new ValidCredentials('ad', '')

                    const username = credentials.usernameCheck()

                    expect(username).toBe(false)
                })
                it("Should return error object if username is too long", () => {
                    const credentials = new ValidCredentials('adasdasdasdasdasdasdwqrqwqrqewwqeqweqeqeqew', '')

                    const username = credentials.usernameCheck()

                    expect(username).toBe(false)
                })
            })

            describe("passwordCheck()", () => {
                it("should return true if password is valid", () => {
                    const credentials = new ValidCredentials('', 'testpassword1')

                    const password = credentials.passwordCheck()

                    expect(password).toBe(true)
                })
                it("should return true if password is valid and have special chars", () => {
                    const credentials = new ValidCredentials('', 'testPassword%1')

                    const password = credentials.passwordCheck()

                    expect(password).toBe(true)
                })
                it("should return false if password is too short", () => {
                    const credentials = new ValidCredentials('', 'test')

                    const password = credentials.passwordCheck()

                    expect(password).toBe(false)
                })
                it("should return false if password does not contain a letter", () => {
                    const credentials = new ValidCredentials('', '12341234')

                    const password = credentials.passwordCheck()

                    expect(password).toBe(false)
                })
                it("should return false if password does not contain a number", () => {
                    const credentials = new ValidCredentials('', 'asdasdasdasdasd')

                    const password = credentials.passwordCheck()

                    expect(password).toBe(false)
                })
            })
        })
    })
})