import { connectFakeDB, dropFakeDB, dropFakeCollections } from "./mongoDataStorageSetup";
import { Todo } from "../../../src/entities/mongo/todoSchema"
import { TodoEntity } from "../../../src/entities/TodoEntity";
import { MongoDataStorage } from "../../../src/dataStorages/MongoDataStorage"

describe("unit", () => {
  describe("dataStorages", () => {
    const testTodo: Omit<TodoEntity, 'id'> = {text: "testText", userId: 'testUserId'}
    const testTodoMongoDataStorage = new MongoDataStorage<TodoEntity>(Todo)

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
            const newTodo = await testTodoMongoDataStorage.create(testTodo)
            const findTodo = await testTodoMongoDataStorage.find({userId: 'testUserId'})
    
            expect(findTodo).toEqual([newTodo])
        })
      });

      describe("findById()", () => {
        it("Should find the element with the given id", async () => {
          const newTodo = await testTodoMongoDataStorage.create(testTodo)

          const findTodo = await testTodoMongoDataStorage.findOneByKey({id: newTodo.id})

          expect(newTodo).toEqual(findTodo)
        })
      })

      describe("create()", () => {
        it("Should create a new object into the db", async () => {
            const newTodo = await testTodoMongoDataStorage.create(testTodo)
            const findNewTodo = await testTodoMongoDataStorage.find({})
    
            expect(findNewTodo).toEqual([newTodo])
        })
      });

      describe("findAndUpdate()", () => {
        it("Should update given object if found", async () => {
            const newTodo = await testTodoMongoDataStorage.create(testTodo);
            const updateTodo = await testTodoMongoDataStorage.update({id: newTodo.id, completed: true})

            expect(updateTodo).toEqual({...newTodo, completed: true})
        })
      });

      describe("findAndDelete()", () => {
        it("Should remove the element with the given Id if found", async () => {
          const newTodo = await testTodoMongoDataStorage.create(testTodo)
          const newTodoId = newTodo.id
          const deletedTodo = await testTodoMongoDataStorage.delete(newTodoId)
          const todoArray = await testTodoMongoDataStorage.find({})
            
          expect(deletedTodo).toEqual(newTodo)
          expect(todoArray).toEqual([])
        })
      });

      describe("deleteMany()", () => {
        it("Should remove all elements of that userId from the collection", async () => {
          await testTodoMongoDataStorage.create(testTodo)
          await testTodoMongoDataStorage.create({ text: "testText2", userId: "testUserId" })

          const deleteAllTodo = await testTodoMongoDataStorage.deleteMany({ userId: "testUserId" })
          const UserTodoArray = await testTodoMongoDataStorage.find({ userId: "testUserId" })

          expect(deleteAllTodo).toEqual(2)
          expect(UserTodoArray).toEqual([])
        })
      })
    });
  });
});
