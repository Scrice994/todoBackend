import { TodoRepository } from "../../../src/repositories/TodoRepository";
import { MongooseDataStorageMock } from "../__mocks__/MongooseDataStorage.mock";
import { TodoEntity } from "../../../src/entities/TodoEntity";
import { describe, it, expect } from "@jest/globals";

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

        it("Should throw and Error when try to create a TodoEntity object with a empty text",async () => {

          await expect(repository.insertOne({text: ""})).rejects.toThrow("Todo text can't be empty")
        })
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

          expect(await repository.deleteOne({id: "mockId"})).toEqual(fakeResponse)
        });
      });
    });
  });
});
