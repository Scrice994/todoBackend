import axios from "axios";
import { clearDB, clearDatabase, closeDatabaseConnection, databaseConnection } from "./utils/mongooseTestUtils";
import { UserCRUD } from '../../src/crud/UserCRUD'

describe("api", () => {
    beforeAll(async () => {
        await databaseConnection()
        await clearDatabase()
      })

      beforeEach(async () => {  
        await clearDB()
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
                const createUser = await axios.post(REGISTER_URL, {username: 'fakeUser123', password: 'testPassword1' })

                const findUser = await axios.get(USER_URL + '/findUSer', { headers: {'Authorization': createUser.data.token }})

                expect(findUser.data.response).toEqual(createUser.data.user)
            })
        })

        describe("POST: /signup",() => {
            it("should return 200 statusCode and specify JSON in header content type", async  () => {
                const request = await axios.post(REGISTER_URL, {username: 'fakeUser123', password: 'testPassword1' })

                expect(request.status).toBe(200)
                expect(request.headers['content-type']).toEqual(expect.stringContaining('json'))
                expect(request.data.user.username).toBe("fakeUser123")
                expect(request.data.token).toBeDefined()
            })

            it("should return 200 statusCode and have a tenantId when a form with groupName is submitted", async () => {
                const request = await axios.post(REGISTER_URL, {username: 'fakeUser123', password: 'testPassword1', groupName: 'Akatsuki'})

                expect(request.status).toBe(200)
                expect(request.data.user).toHaveProperty('tenantId')
                expect(request.data.user.tenantId).toBeDefined()
            })

            it("Should return 400 statusCode and errorMessage if user already exist in the DB", async () => {
                await axios.post(REGISTER_URL, {username: 'fakeUser123', password: 'testPassword1', confirmPassword: 'testPassword1'}).catch(err => {
                    expect(err.response.status).toBe(400)
                    expect(err.response.data).toEqual({message: "This user already exist"})
                })
            })

            it("When create two users with different groupName, userId and tenantId between users must be not equal", async () => {
                const firstUser = await axios.post(REGISTER_URL, {username: 'fakeUser', password: 'testPassword1', groupName: 'Akatsuki'})
                const secondUSer = await axios.post(REGISTER_URL, {username: 'fakeUser2', password: 'testPassword1', groupName: 'Libra'})
                
                expect(firstUser.data.user.id).not.toEqual(secondUSer.data.user.id)
                expect(firstUser.data.user.tenantId).not.toEqual(secondUSer.data.user.tenantId)
            })

            it("Should return 400 statusCode and errorMessage if groupName already exist", async () => {
                const firstUser = await axios.post(REGISTER_URL, {username: 'fakeUser', password: 'testPassword1', groupName: 'Akatsuki'})
                const secondUser = await axios.post(REGISTER_URL, {username: 'fakeUser2', password: 'testPassword1', groupName: 'Akatsuki'})
                    .catch(err => {
                        expect(err.response.status).toBe(400)
                        expect(err.response.data).toEqual({ message: "This group name already exist" })
                    })
            })

            it("Should return 404 statusCode and errorMessage if username is not provided", async () => {
                await axios.post(REGISTER_URL, { password: 'testPassword1' })
                .catch(err => {
                    expect(err.response.status).toBe(404)
                    expect(err.response.data).toEqual({message: "Missing required @parameter username"})
                })
            })

            it("Should return 404 statusCode and errorMessage if password is not provided", async () => {
                await axios.post(REGISTER_URL, {username: 'fakeUser123' })
                .catch(err => {
                    expect(err.response.status).toBe(404)
                    expect(err.response.data).toEqual({message: "Missing required @parameter password"})
                })
            })

            it("Should return 404 statusCode and errorMessage if username do not match the regex", async () => {
                await axios.post(REGISTER_URL, { username: 'a', password: 'testPassword1', confirmPassword: 'testPassword1'})
                .catch(err => {
                    expect(err.response.status).toBe(404)
                    expect(err.response.data).toEqual({message: "Invalid @parameter username"})
                })
            })

            it("Should return 404 statusCode and errorMessage if password do not match the regex", async () => {
                await axios.post(REGISTER_URL, {username: 'fakeUser123', password: 'asd', confirmPassword: 'asd'})
                .catch(err => {
                    expect(err.response.status).toBe(404)
                    expect(err.response.data).toEqual({message: "Invalid @parameter password"})
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

        describe("POST: /Admin/createGroupMember", () => {
            it("should return statusCode 200 and success message when a group Admin try to create a group member", async () => {
                const createAdmin = await axios.post(REGISTER_URL, {username: 'fakeUser123', password: 'testPassword1', groupName: 'Akatsuki'})

                const createMember = await axios.post(
                    USER_URL + '/Admin/createGroupMember', 
                    { username: 'fakeGroupMember', password: 'testPassword1' }, 
                    { headers: {'Authorization': createAdmin.data.token }}
                )

                expect(createMember.status).toBe(200)
                expect(createMember.data).toEqual({ success: "User created successfully" })
            })

            it("should return statusCode 404 errorMessage when a group Admin try to create a member without providing a username", async () => {
                const createAdmin = await axios.post(REGISTER_URL, {username: 'fakeUser123', password: 'testPassword1', groupName: 'Akatsuki'})

                    await axios.post(
                    USER_URL + '/Admin/createGroupMember', 
                    { password: 'testPassword1' }, 
                    { headers: {'Authorization': createAdmin.data.token }}
                ).catch(
                    res => {
                        expect(res.response.status).toBe(404)
                        expect(res.response.data).toEqual({ message: "Missing required @parameter username" })
                    }
                )
            })

            it("should return statusCode 404 errorMessage when an Admin try to create a member providing invalid username", async () => {
                const createAdmin = await axios.post(REGISTER_URL, {username: 'fakeUser123', password: 'testPassword1', groupName: 'Akatsuki'})

                const createMember = await axios.post(
                USER_URL + '/Admin/createGroupMember', 
                { username: 'fake&User123', password: 'testPassword1' }, 
                { headers: {'Authorization': createAdmin.data.token }}
                ).catch(
                    res => {
                        expect(res.response.status).toBe(404)
                        expect(res.response.data).toEqual({ message: "Invalid @parameter username" })
                    }
                )

                expect(createMember?.status).toBe(undefined)
            })

            it("should return statusCode 404 errorMessage when a group Admin try to create a member without providing a password", async () => {
                const createAdmin = await axios.post(REGISTER_URL, {username: 'fakeUser123', password: 'testPassword1', groupName: 'Akatsuki'})

                const createMember = await axios.post(
                    USER_URL + '/Admin/createGroupMember', 
                    { username: 'fakeGroupMember' }, 
                    { headers: {'Authorization': createAdmin.data.token }}
                ).catch(
                    res => {
                        expect(res.response.status).toBe(404)
                        expect(res.response.data).toEqual({ message: "Missing required @parameter password" })
                    }
                )

                expect(createMember?.status).toBe(undefined)
            })

            it("should return statusCode 404 errorMessage when an Admin try to create a member providing invalid password", async () => {
                const createAdmin = await axios.post(REGISTER_URL, {username: 'fakeUser123', password: 'testPassword1', groupName: 'Akatsuki'})

                const createMember = await axios.post(
                USER_URL + '/Admin/createGroupMember', 
                { username: 'fakeGroupMember', password: 'testPassword' }, 
                { headers: {'Authorization': createAdmin.data.token }}
                ).catch(
                    res => {
                        expect(res.response.status).toBe(404)
                        expect(res.response.data).toEqual({ message: "Invalid @parameter password" })
                    }
                )

                expect(createMember?.status).toBe(undefined)
            })

            it("should return statusCode 400 and errorMessage when try to create an user that already exist", async () => {
                const createAdmin = await axios.post(REGISTER_URL, {username: 'fakeUser123', password: 'testPassword1', groupName: 'Akatsuki'})

                const createFirstMember = await axios.post(
                    USER_URL + '/Admin/createGroupMember', 
                    { username: 'fakeGroupMember', password: 'testPassword1' }, 
                    { headers: {'Authorization': createAdmin.data.token }}
                )

                const createSecondMember = await axios.post(
                    USER_URL + '/Admin/createGroupMember', 
                    { username: 'fakeGroupMember', password: 'testPassword1' }, 
                    { headers: {'Authorization': createAdmin.data.token }}
                ).catch( res => {
                        expect(res.response.status).toBe(400)
                        expect(res.response.data).toEqual({ message: "This user already exist" })
                    }
                )

                expect(createSecondMember?.status).toBe(undefined)
            })

            it("should return statusCode 403 and errorMessage when a not Admin user trying to create a new member", async () => {
                const notAdmin = await axios.post(REGISTER_URL, {username: 'fakeUser123', password: 'testPassword1' })

                const createMember = await axios.post(
                    USER_URL + '/Admin/createGroupMember', 
                    { username: 'fakeGroupMember', password: 'testPassword1' }, 
                    { headers: {'Authorization': notAdmin.data.token }}
                ).catch( res => {
                    expect(res.response.status).toBe(403)
                    expect(res.response.data).toEqual({ message: "you are not Authorized" })
                })

                expect(createMember?.status).toBe(undefined)
            })

            it("shoudl return statusCode 404 and errorMessage when Admin user is not found in the db", async () => {
                const createAdmin = await axios.post(REGISTER_URL, {username: 'fakeUser123', password: 'testPassword1', groupName: 'Akatsuki'})

                await clearDB()

                const createMember = await axios.post(
                    USER_URL + '/Admin/createGroupMember', 
                    { username: 'fakeGroupMember', password: 'testPassword1' }, 
                    { headers: {'Authorization': createAdmin.data.token }}
                ).catch( res => {
                    expect(res.response.status).toBe(404)
                    expect(res.response.data).toEqual({ message: "User not found" })
                })

                expect(createMember?.status).toBe(undefined)
            })
        })
    })
})