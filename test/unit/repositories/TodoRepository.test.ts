import { TodoRepository } from "../../../src/repositories/TodoRepository";
import { MongooseDataStorageMock } from "../__mocks__/MongooseDataStorage.mock";
import { TodoEntity } from "../../../src/entities/TodoEntity";
import { describe, it, jest, expect } from "@jest/globals";

describe("unit", () => {
  describe("repositories", () => {
    describe("TodoRepository", () => {
      const mongooseDataStorageMock = new MongooseDataStorageMock<TodoEntity>();


      describe("getAll()", () => {
        it("Should return all TodoEntity objects in the data storage", async () => {
            mongooseDataStorageMock.find.mockImplementationOnce(() => Promise.resolve([{
                id: 'mockId',
                text: 'mockText',
                completed: false
            }]))

          const repository = new TodoRepository(mongooseDataStorageMock);

          expect(await repository.getAll())
            .toEqual([{
                id: 'mockId',
                text: 'mockText',
                completed: false
            }])
        });
      });

      describe("insertOne()", () => {
        it("Should create a new TodoEntity object", async () => {
          mongooseDataStorageMock.create.mockImplementationOnce(() => Promise.resolve({
            id: 'mockId',
            text: 'mockText',
            completed: false
          }))

          const repository = new TodoRepository(mongooseDataStorageMock);

          expect(await repository.insertOne({text: 'mockText'}))
            .toEqual({
              id: 'mockId',
              text: 'mockText',
              completed: false
            })

        });
      });

      describe("updateOne()", () => {
        it("Should update an existing TodoEntity", async () => {
          mongooseDataStorageMock.update.mockImplementationOnce(() => Promise.resolve({
            id: 'mockId',
            text: 'mockText',
            completed: true
          }))

          const repository = new TodoRepository(mongooseDataStorageMock);

          expect(await repository.updateOne({id: "mockId", completed: true}))
            .toEqual({
              id: "mockId",
              text: "mockText",
              completed: true
            })
        });
      });

      describe("deleteOne()", () => {
        it("Should delete a given TodoEntity by id",async () => {
          mongooseDataStorageMock.delete.mockImplementationOnce(() => Promise.resolve({
            id: 'mockId',
            text: 'mockText',
            completed: false
        }))

          const repository = new TodoRepository(mongooseDataStorageMock)

          expect(await repository.deleteOne("mockId"))
            .toEqual({
              id: "mockId",
              text: "mockText",
              completed: false
            })
        });
      });
    });
  });
});
