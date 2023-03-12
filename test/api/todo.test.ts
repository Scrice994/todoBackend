import axios from "axios";
import { expect, describe, it, beforeEach, afterAll } from "@jest/globals";
import { databaseConnection, closeDatabaseConnection, clearDatabase, initializeData, clearCollection } from "./utils/mongooseTestUtils";

const todoTest = { text: "TestoProva" };

const dbInit = [
  {
    id: "1",
    text: "fakeText1",
    completed: false,
  },
  {
    id: "2",
    text: "fakeText2",
    completed: true,
  },
];

describe("api", () => {

  beforeAll(async () => {
    await databaseConnection()
    await clearDatabase()
  })

  beforeEach(async () => {
    await initializeData(dbInit)
  });

  afterEach(async () => {  
    await clearCollection()
  })

  afterAll(async () => {
    await closeDatabaseConnection()
  })


  describe("/todo", () => {
    const TODO_URL = "http://localhost:3005/todo";

    describe("GET", () => {
      it("Should get all todos in storage", async () => {
        const response = await axios.get(TODO_URL);
        expect(response.data).toEqual({ response: dbInit });
      });
    });

    describe("POST", () => {
      it("Should insert a new todo", async () => {
        const response = await axios.post(TODO_URL, todoTest);
        console.log(response.data);

        expect(response.data).toEqual({
          response: {
            id: response.data.response.id,
            text: "TestoProva",
            completed: false,
          },
        });
      });
    });

    describe("PUT", () => {
      it("Should update todo", async () => {
        const updatedTodo = await axios.put(`${TODO_URL}/1`, {
          completed: true,
        });

        expect(updatedTodo.data).toEqual({
          response: {
            ...dbInit[0],
            completed: true,
          },
        });
      });
    });

    describe("DELETE", () => {
      it("Should delete the todo with the given id", async () => {
        const deletedTodo = await axios.delete(`${TODO_URL}/2`);

        const response = await axios.get(TODO_URL);

        expect(deletedTodo.data).toEqual({ response: dbInit[1] });

        expect(response.data).toEqual({ response: [dbInit[0]] });
      });
    });

    describe("DELETE ALL", () => {
      it("Should remove all todos from database", async () => {
        const deleteAllTodos = await axios.delete(`${TODO_URL}/deleteAll`)

        const response = await axios.get(TODO_URL)

        expect(deleteAllTodos.data).toEqual({ response: 2 })
        expect(response.data).toEqual({ response: [] })
      })
    })
  });
});
