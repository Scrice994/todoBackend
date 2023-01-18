import { describe, it, beforeAll, afterAll, beforeEach,expect,  } from "@jest/globals";
import { connectFakeDB, dropFakeDB, dropFakeCollections } from "./mongoDataStorageSetup";
import { Todo } from "../../../src/entities/mongo/mongoSchema"
import { TodoEntity } from "../../../src/entities/TodoEntity";
import { MongoDataStorage } from "../../../src/dataStorages/MongoDataStorage"

describe("unit", () => {
  describe.only("dataStorages", () => {
    const testTodo: TodoEntity = {text: "testText"}
    const testMongoDataStorage = new MongoDataStorage<TodoEntity>(Todo)

    beforeAll( async () => {
        connectFakeDB()
    })
    afterAll(async () => {
        dropFakeDB()
    })
    beforeEach(async () => {
        dropFakeCollections()
    })

    describe("MongoDataStorage", () => {
      describe("find()", () => {
        it("Should find all object in the db", async () => {
            const newTodo = await testMongoDataStorage.create(testTodo)
            const findTodo = await testMongoDataStorage.find()
    
            expect(findTodo).toEqual([newTodo])
        })
      });

      describe("create()", () => {
        it("Should create a new object into the db", async () => {
            const newTodo = await testMongoDataStorage.create(testTodo)
            const findNewTodo = await testMongoDataStorage.find()
    
            expect(newTodo.id).toBeDefined()
            expect(newTodo.completed).toBe(false)
            expect(newTodo.text).toBe('testText')
            expect(findNewTodo).toEqual([newTodo])
        })
      });
      describe("findAndUpdate()", () => {
        it("should do the update of the given object if found", async () => {
            const newTodo = await testMongoDataStorage.create(testTodo);
            const updateTodo = await testMongoDataStorage.update({id: newTodo.id, completed: true})

            expect(updateTodo).toEqual({...newTodo, completed: true})
        })
      });
      describe("findAndDelete()", () => {
        it("should return the removed element and the collection must be empty", async () => {
          const newTodo = await testMongoDataStorage.create(testTodo)
          const newTodoId = newTodo.id
          const deletedTodo = await testMongoDataStorage.delete({id: newTodoId})
          const todoArray = await testMongoDataStorage.find()
            
          expect(deletedTodo).toEqual(newTodo)
          expect(todoArray).toEqual([])
        })
      });
    });
  });
});
