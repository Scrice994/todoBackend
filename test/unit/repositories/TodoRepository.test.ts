import { TodoRepository } from "../../../src/repositories/TodoRepository";
import { MongooseDataStorageMock } from "../__mocks__/MongooseDataStorage.mock";
import { TodoEntity } from "../../../src/entities/TodoEntity";

describe("unit", () => {
  describe("repositories", () => {
    describe("TodoRepository", () => {
      const mongooseDataStorageMock = new MongooseDataStorageMock<TodoEntity>();
      const repository = new TodoRepository(mongooseDataStorageMock);
      const fakeResponse = {
        id: 'mockId',
        text: 'mockText',
        completed: false
      }
      const fakeResponseUpdate = {
        id: 'mockId',
        text: 'mockText',
        completed: true
      }

      describe("getAll()", () => {
        it("Should return all TodoEntity objects in the data storage", async () => {
          mongooseDataStorageMock.find.mockImplementationOnce(() => Promise.resolve([fakeResponse]))

          expect(await repository.getAll()).toEqual([fakeResponse])
        });
      });

      describe("insertOne()", () => {
        it("Should create a new TodoEntity object", async () => {
          mongooseDataStorageMock.create.mockImplementationOnce(() => Promise.resolve(fakeResponse))

          expect(await repository.insertOne({text: 'mockText'})).toEqual(fakeResponse)
        });
      });

      describe("updateOne()", () => {
        it("Should update an existing TodoEntity", async () => {
          mongooseDataStorageMock.update.mockImplementationOnce(() => Promise.resolve(fakeResponseUpdate))

          expect(await repository.updateOne({id: "mockId", completed: true})).toEqual(fakeResponseUpdate)
        });
      });

      describe("deleteOne()", () => {
        it("Should delete a given TodoEntity by id",async () => {
          mongooseDataStorageMock.delete.mockImplementationOnce(() => Promise.resolve(fakeResponse))

          expect(await repository.deleteOne("mockId")).toEqual(fakeResponse)
        });
      });

      describe("deleteAllTodos()", () => {
        it("Should delete all todos", async () => {
          mongooseDataStorageMock.deleteMany.mockImplementationOnce(() => Promise.resolve(2))

          expect(await repository.deleteAllTodos()).toEqual(2)
        })
      })
    });
  });
});
