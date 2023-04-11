import axios from "axios";
import { databaseConnection, closeDatabaseConnection, clearDatabase, initializeTodoData, clearCollection } from "./utils/mongooseTestUtils";

const TODO_URL = "http://localhost:3005/todo";
const REGISTER_URL = "http://localhost:3005/user/signup"
const LOGIN_URL = "http://localhost:3005/user/login"

describe("api", () => {

  beforeAll(async () => {
    await databaseConnection()
    await clearDatabase()
  })

  beforeEach(async () => {
    const createUser = await axios.post(REGISTER_URL, {username: 'TestUsername', password: 'TestPassword123', confirmPassword: 'TestPassword123'})
    await initializeTodoData(createUser.data.user.id)
  });

  afterEach(async () => {
    await clearCollection('users')  
    await clearCollection('todos')
  })

  afterAll(async () => {
    await closeDatabaseConnection()
  })


  describe("/todo", () => {
    describe("authMiddleware", () => {
      it("Should return statusCode 401 and error.message if JWT is not provided", async () => {
        await axios.post(LOGIN_URL, {username: 'TestUsername', password: 'TestPassword123'})
        await axios.get(TODO_URL, {headers: {'Authorization': ''}}).catch(err => {
          expect(err.response.status).toBe(401)
          expect(err.response.data).toEqual({ message: 'You are not Authorized to this route'})
        });
      })

      
      it("Should return statusCode 401 and error.message if JWT does not match the regex", async () => {
        await axios.post(LOGIN_URL, {username: 'TestUsername', password: 'TestPassword123'})
        await axios.get(TODO_URL, {headers: {'Authorization': 'fakeToken'}}).catch(err => {
          expect(err.response.status).toBe(401)
          expect(err.response.data).toEqual({ message: 'You are not Authorized to this route'})
        });
      })

      it("Should return statusCode 401 and error.message if JWT match the regex but is not valid", async () => {
        const userLogin = await axios.post(LOGIN_URL, {username: 'TestUsername', password: 'TestPassword123'})
        const invalidToken = userLogin.data.token.slice(0, -1)
        await axios.get(TODO_URL, {headers: {'Authorization': invalidToken}}).catch(err => {
          expect(err.response.status).toBe(401)
          expect(err.response.data).toEqual({ message: 'invalid Token'})
        });
      })
    })

    describe("GET", () => {
      it("Should get all todos in storage", async () => {
        const loginUser = await axios.post(LOGIN_URL, {username: 'TestUsername', password: 'TestPassword123'})
        
        const response = await axios.get(TODO_URL, {headers: {'Authorization': loginUser.data.token}});

        expect(response.data).toEqual({ response: [
          {
            id: "1",
            text: "fakeText1",
            completed: false,
            userId: loginUser.data.user.id
          },
          {
            id: "2",
            text: "fakeText2",
            completed: true,
            userId: loginUser.data.user.id
          },
        ]});
      });
    });

    describe("POST", () => {
      it("Should return statusCode 200 and newTodo in the DB", async () => {
        const loginUser = await axios.post(LOGIN_URL, {username: 'TestUsername', password: 'TestPassword123'})

        const newTodo = await axios.post(TODO_URL, {text: "TestText", usedId: loginUser.data.user.id}, {headers: {'Authorization': loginUser.data.token}});
        console.log(newTodo.data);

        expect(newTodo.status).toBe(200)
        expect(newTodo.data).toEqual({
          response: {
            text: "TestText",
            completed: false,
            userId: newTodo.data.response.userId,
            id: newTodo.data.response.id,
          },
        });
      });

      it("should return statusCode 404 and error.message if newTodo text is missing", async () => {
        const loginUser = await axios.post(LOGIN_URL, {username: 'TestUsername', password: 'TestPassword123'})

        await axios.post(TODO_URL, {text: "", usedId: loginUser.data.user.id}, {headers: {'Authorization': loginUser.data.token}})
        .catch(err => {
          expect(err.response.status).toBe(404)
          expect(err.response.data).toEqual({ message: 'Missing required @parameter text' })
        });
    
      })
      it("should return statusCode 404 and error.message if newTodo userId is missing", async () => {
        const loginUser = await axios.post(LOGIN_URL, {username: 'TestUsername', password: 'TestPassword123'})

        await axios.post(TODO_URL, {text: "TestText"}, {headers: {'Authorization': loginUser.data.token}})
        .catch(err => {
          expect(err.response.status).toBe(404)
          expect(err.response.data).toEqual({ message: 'Missing required @parameter userId' })
        });
    
      })
    })
    describe("PUT", () => {
      it("Should return statusCode 200 and the updated todo", async () => {
        const loginUser = await axios.post(LOGIN_URL, {username: 'TestUsername', password: 'TestPassword123'})
        const updatedTodo = await axios.put(`${TODO_URL}/1`, { completed: true }, {headers: {'Authorization': loginUser.data.token}});

        expect(updatedTodo.data).toEqual({
          response: {
            id: "1",
            text: "fakeText1",
            completed: true,
            userId: updatedTodo.data.response.userId
          }
        });
      });
    });

    describe("DELETE", () => {
      it("Should delete the todo with the given id", async () => {
        const loginUser = await axios.post(LOGIN_URL, {username: 'TestUsername', password: 'TestPassword123'})
        const deletedTodo = await axios.delete(`${TODO_URL}/2`, {headers: {'Authorization': loginUser.data.token}});

        const findTodo = await axios.get(TODO_URL, {headers: {'Authorization': loginUser.data.token}});

        expect(deletedTodo.data).toEqual({ response:         {
            id: "2",
            text: "fakeText2",
            completed: true,
            userId: deletedTodo.data.response.userId
          }
        });

        expect(findTodo.data).toEqual({ response: [{
            id: "1",
            text: "fakeText1",
            completed: false,
            userId: findTodo.data.response[0].userId
          }]
        });
      });
    });

    describe("DELETE ALL", () => {
      it("Should remove all todos from database", async () => {
        const loginUser = await axios.post(LOGIN_URL, {username: 'TestUsername', password: 'TestPassword123'})

        const deleteAllTodos = await axios.delete(`${TODO_URL}/deleteAll`, {headers: {'Authorization': loginUser.data.token}})

        const response = await axios.get(TODO_URL, {headers: {'Authorization': loginUser.data.token}})

        expect(deleteAllTodos.data).toEqual({ response: 2 })
        expect(response.data).toEqual({ response: [] })
      })
    })
  })
})
