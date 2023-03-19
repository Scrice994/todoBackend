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

        describe("POST: /signup",() => {
            it("should return 200 statusCode and specify JSON in header content type", async  () => {
                const request = await axios.post(REGISTER_URL, {username: 'fakeUser123', password: 'asdasd123'})

                expect(request.status).toBe(200)
                expect(request.headers['content-type']).toEqual(expect.stringContaining('json'))
                expect(request.data.user.username).toBe("fakeUser123")
                expect(request.data.token).toBeDefined()
            })

            it("Should return 400 statusCode and errorMessage if username is not provided or does not match the regex", async () => {
                await axios.post(REGISTER_URL, {username: '', password: 'asdasd123'})
                .catch(err => {
                    expect(err.response.status).toBe(400)
                    expect(err.response.data).toEqual({message: "Username must have only alphanumeric chars and be 4-20 length"})
                })
            })
            it("Should return 400 statusCode and errorMessage if password id not provided or does not match the regex", async () => {
                await axios.post(REGISTER_URL, {username: 'fakeUser123', password: 'asd'})
                .catch(err => {
                    expect(err.response.status).toBe(400)
                    expect(err.response.data).toEqual({message: "Password must be at least 6 length, and have at least 1 number and 1 letter"})
                })
            })
            it("Should return 400 statusCode and errorMessage if user already exist in the DB", async () => {
                await axios.post(REGISTER_URL, {username: 'fakeUser123', password: 'asdasd123'})

                await axios.post(REGISTER_URL, {username: 'fakeUser123', password: 'asdasd123'}).catch(err => {
                    expect(err.response.status).toBe(400)
                    expect(err.response.data).toEqual({message: "This user already exist"})
                })
            })
        })

        describe("POST: /login",() => {
            it("should return 200 statusCode and specify JSON in header content type", async  () => {
                const createUser = await axios.post(REGISTER_URL, {username: 'fakeUser123', password: 'asdasd123'})
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
                await axios.post(REGISTER_URL, {username: 'fakeUser123', password: 'asdasd123'})
                await axios.post(LOGIN_URL, {username: 'fakeUser123', password: 'asdasd13'}).catch( err => {
                    expect(err.response.status).toBe(401)
                    expect(err.response.data).toEqual({ message: "Wrong credentials"})
                })
            })

        })
    })
})