import axios from "axios";
import { databaseConnection, closeDatabaseConnection, clearDatabase, initializeData, clearCollection } from "./utils/mongooseTestUtils";
import { User } from "../../src/entities/mongo/userSchema";
import { JWTHandler } from '../../src/utils/tokenHandler/JWTHandler';
import { JsonWebTokenPkg } from '../../src/utils/tokenHandler/JsonWebTokenPkg';

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
            })
        })

        describe("POST: /login",() => {
            it("should return 200 statusCode and specify JSON in header content type", async  () => {
                const createUser = await axios.post(REGISTER_URL, {username: 'fakeUser123', password: 'asdasd123'})
                const request = await axios.post(LOGIN_URL, {username: 'fakeUser123', password: 'asdasd123'})

                expect(request.status).toBe(200)
                expect(request.headers['content-type']).toEqual(expect.stringContaining('json'))
                expect(createUser.data.user).toEqual(request.data.user)
            })
        })
    })
})