import axios from "axios";
import { expect, describe, it, beforeEach, afterAll } from "@jest/globals";
import { clearDatabase, initDatabase} from "./utils/testUtils";
const todoTest = { text: "TestoProva" };


const dbInit = [{
  id: "1",
  text: 'fakeText1',
  completed: false
}, {
  id: "2",
  text: 'fakeText2',
  completed: true
}];

describe("api", () => {
  beforeEach(async () => {
    await clearDatabase();
    await initDatabase(dbInit);
  });

  afterAll(async () => {
    await clearDatabase()
  })

  describe("/todo", () => {
    const TODO_URL = "http://localhost:3005/todo";

    describe("GET", () => {
      it("Should get all todos in storage", async () => {
        const response = await axios.get(TODO_URL);

        expect(response.data).toEqual(dbInit);
      });
    });

     describe("POST", () => {
       it("Should insert a new todo", async () => {
         const response = await axios.post(
           TODO_URL,
           todoTest
         )

         expect(response.data).toEqual({
           id: response.data.id,
           text: 'TestoProva',
           completed: false
         });
       });
     });

     describe("PUT", () => {
       it("Should update todo", async () => {

         const updatedTodo = await axios.put(
           `${TODO_URL}/1`,
           { completed: true }
         );

         expect(updatedTodo.data).toEqual({
           text: "fakeText1",
           completed: true,
           id: "1"
         });
       });
     });

    describe("DELETE", () => {
      it("Should delete the todo with the given id", async () => {
        const deletedTodo = await axios.delete(
          `${TODO_URL}/2`
        );

        const response = await axios.get(TODO_URL);

        expect(deletedTodo.data).toEqual({
          id: "2",
          text: 'fakeText2',
          completed: true
        });

        expect(response.data).toEqual([{
          id: "1",
          text: 'fakeText1',
          completed: false
        }]);
      });
    });
  });
});
