import axios from "axios";
import { clearCollection, clearDatabase, closeDatabaseConnection, databaseConnection } from "./utils/mongooseTestUtils";

describe("api", () => {
    beforeAll(async () => {
        await databaseConnection()
        await clearDatabase()
      })

      afterEach(async () => {  
        await clearCollection('users')
      })
    
      afterAll(async () => {
        await closeDatabaseConnection()
      })

    describe("user routes test", () => {
        const USER_URL = "http://localhost:3005/user";
        const REGISTER_URL = USER_URL + '/signup'
        const LOGIN_URL = USER_URL + '/login'

        describe("GET: /findUser", () => {
            it("should return 200 statusCode and the user that match the given id",async () => {
                const createUser = await axios.post(REGISTER_URL, {username: 'fakeUser123', password: 'testPassword1', confirmPassword: 'testPassword1'})

                const findUser = await axios.get(USER_URL + '/findUSer', { headers: {'Authorization': createUser.data.token }})

                expect(findUser.data.response).toEqual(createUser.data.user)
            })
        })

        describe("POST: /signup",() => {
            it("should return 200 statusCode and specify JSON in header content type", async  () => {
                const request = await axios.post(REGISTER_URL, {username: 'fakeUser123', password: 'testPassword1', confirmPassword: 'testPassword1'})

                expect(request.status).toBe(200)
                expect(request.headers['content-type']).toEqual(expect.stringContaining('json'))
                expect(request.data.user.username).toBe("fakeUser123")
                expect(request.data.token).toBeDefined()
            })

            it("should return 200 statusCode and have a tenantId when a form with groupName is submitted", async () => {
                const request = await axios.post(REGISTER_URL, {username: 'fakeUser123', password: 'testPassword1', confirmPassword: 'testPassword1', groupName: 'Akatsuki'})

                expect(request.status).toBe(200)
                expect(request.data.user).toHaveProperty('tenantId')
                expect(request.data.user.tenantId).toBeDefined()
            })

            test("When create two users with different groupName, userId and tenantId between users must be not equal", async () => {
                const firstUser = await axios.post(REGISTER_URL, {username: 'fakeUser', password: 'testPassword1', confirmPassword: 'testPassword1', groupName: 'Akatsuki'})
                const secondUSer = await axios.post(REGISTER_URL, {username: 'fakeUser2', password: 'testPassword1', confirmPassword: 'testPassword1', groupName: 'Libra'})
                
                expect(firstUser.data.user.id).not.toEqual(secondUSer.data.user.id)
                expect(firstUser.data.user.tenantId).not.toEqual(secondUSer.data.user.tenantId)
            })

            it("Should return 400 statusCode and errorMessage if username do not match confirm password", async () => {
                await axios.post(REGISTER_URL, {username: 'fakeUser123' , password: 'Password1', confirmPassword: 'testPassword1'})
                .catch(err => {
                    expect(err.response.status).toBe(400)
                    expect(err.response.data).toEqual({message: "Password & confirm password do not match"})
                })
            })

            it("Should return 400 statusCode and errorMessage if username is not provided", async () => {
                await axios.post(REGISTER_URL, { password: 'testPassword1', confirmPassword: 'testPassword1' })
                .catch(err => {
                    expect(err.response.status).toBe(400)
                    expect(err.response.data).toEqual({message: "Username is required"})
                })
            })

            it("Should return 400 statusCode and errorMessage if password is not provided", async () => {
                await axios.post(REGISTER_URL, {username: 'fakeUser123', confirmPassword: 'testPassword1' })
                .catch(err => {
                    expect(err.response.status).toBe(400)
                    expect(err.response.data).toEqual({message: "Password is required"})
                })
            })

            it("Should return 400 statusCode and errorMessage if confimPassword is not provided", async () => {
                await axios.post(REGISTER_URL, {username: 'fakeUser123' , password: 'testPassword1' })
                .catch(err => {
                    expect(err.response.status).toBe(400)
                    expect(err.response.data).toEqual({message: "Confirm password is required"})
                })
            })

            it("Should return 400 statusCode and errorMessage if username do not match the regex", async () => {
                await axios.post(REGISTER_URL, { username: 'a', password: 'testPassword1', confirmPassword: 'testPassword1'})
                .catch(err => {
                    expect(err.response.status).toBe(400)
                    expect(err.response.data).toEqual({message: "Username must have only alphanumeric chars and be 4-20 length"})
                })
            })
            it("Should return 400 statusCode and errorMessage if password do not match the regex", async () => {
                await axios.post(REGISTER_URL, {username: 'fakeUser123', password: 'asd', confirmPassword: 'asd'})
                .catch(err => {
                    expect(err.response.status).toBe(400)
                    expect(err.response.data).toEqual({message: "Password must be at least 6 length, and have at least 1 number and 1 letter"})
                })
            })
            it("Should return 400 statusCode and errorMessage if user already exist in the DB", async () => {
                await axios.post(REGISTER_URL, {username: 'fakeUser123', password: 'testPassword1', confirmPassword: 'testPassword1'}).catch(err => {
                    expect(err.response.status).toBe(400)
                    expect(err.response.data).toEqual({message: "This user already exist"})
                })
            })
        })

        describe("POST: /login",() => {
            it("should return 200 statusCode and specify JSON in header content type", async  () => {
                const createUser = await axios.post(REGISTER_URL, {username: 'fakeUser123', password: 'asdasd123', confirmPassword: 'asdasd123'})
                const request = await axios.post(LOGIN_URL, {username: 'fakeUser123', password: 'asdasd123'})

                expect(request.status).toBe(200)
                expect(request.headers['content-type']).toEqual(expect.stringContaining('json'))
                expect(createUser.data.token).toBeDefined()
            })

            it("Should return 401 statusCode and errorMessage when username is not found in DB", async () => {
                await axios.post(LOGIN_URL, {username: 'fakeUser123', password: 'asdasd123'}).catch( err => {
                    expect(err.response.status).toBe(401)
                    expect(err.response.data).toEqual({ message: "Wrong credentials"})
                })
            })

            it("Should return 401 statusCode and errorMessage when user exist but password is invalid", async () => {
                await axios.post(REGISTER_URL, {username: 'fakeUser123', password: 'asdasd123', confirmPassword: 'asdasd123'})
                await axios.post(LOGIN_URL, {username: 'fakeUser123', password: 'asdasd13'}).catch( err => {
                    expect(err.response.status).toBe(401)
                    expect(err.response.data).toEqual({ message: "Wrong credentials"})
                })
            })

        })
    })
})