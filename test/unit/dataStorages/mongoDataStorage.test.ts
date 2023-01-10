import { describe, it, beforeAll, afterAll, beforeEach,expect } from "@jest/globals";
import { connectFakeDB, dropFakeDB, dropFakeCollections } from "./mongoDataStorageSetup";
import { Todo } from "../../../src/entities/mongo/mongoSchema"
import { MongoDataStorage } from "../../../src/dataStorages/MongoDataStorage"

describe("unit", () => {
  describe("dataStorages", () => {
    const testTodo = "testText"
    const testMongoDataStorage = new MongoDataStorage(Todo)

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
      describe.skip("findAndUpdate()", () => {});
      describe.skip("findAndDelete()", () => {});
    });
  });
});
