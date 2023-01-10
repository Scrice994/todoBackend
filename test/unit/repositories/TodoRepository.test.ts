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
          const repository = new TodoRepository(mongooseDataStorageMock);

          expect(await repository.insertOne('mockTextProva'))
            .toEqual({
              id: 'mockId',
              text: 'mockTextProva',
              completed: false
            })

        });
      });

      describe("updateOne()", () => {
        it("Should update an existing TodoEntity", async () => {
          const repository = new TodoRepository(mongooseDataStorageMock);

          expect(await repository.updateOne("mockId", true))
            .toEqual({
              id: "mockId",
              text: "mockText",
              completed: true
            })
        });
      });

      describe("deleteOne()", () => {
        it.skip("Should delete a given TodoEntity by id", () => {});
      });
    });
  });
});
