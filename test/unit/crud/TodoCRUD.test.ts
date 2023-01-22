import { describe, it, expect } from "@jest/globals";
import { RepositoryMock } from "../__mocks__/Repository.mock";
import { TodoEntity } from "../../../src/entities/TodoEntity";
import { TodoCRUD } from "../../../src/crud/TodoCRUD";

describe("unit", () => {
    describe("crud", () => {
        describe("TodoCRUD", () => {
            const TodoRepositoryMock = new RepositoryMock<TodoEntity>();
            const CRUD = new TodoCRUD(TodoRepositoryMock);
            const fakeResponse = {
                id: 'mockId',
                text: 'mockText',
                completed: false
            }
            const fakeResponseUpdate = {
                    id: 'mockId',
                    text: 'newText',
                    completed: true
            }

            describe("read()", () => {
                it("Should return all elements from the repository", async () => {
                    TodoRepositoryMock.getAll.mockImplementationOnce(() => Promise.resolve([fakeResponse]))
                
                    expect(await CRUD.read()).toEqual({
                        statusCode: 200,
                        data: {
                            response: [fakeResponse]
                        }
                    })
                })
            });

            describe("create()", () => {
                it("Should create a new element in the repository",async () => {
                    TodoRepositoryMock.insertOne.mockImplementationOnce(() => Promise.resolve(fakeResponse))

                    expect(await CRUD.create({text: "mockText"})).toEqual({
                        statusCode: 200,
                        data: {
                            response: fakeResponse
                        }
                    })
                })

                it("Should throw and Error when try to create a TodoEntity object with a empty text", async () => {
                    const response = await CRUD.create(JSON.parse(JSON.stringify({})))

                    expect(response).toEqual({
                        statusCode: 400,
                        data: {
                            message: "Missing required @parameter text"
                        }
                    })
                  })
            })

            describe("update()", () => {
                it("should return the updated element from the repository", async () => {
                    TodoRepositoryMock.updateOne.mockImplementationOnce(() => Promise.resolve(fakeResponseUpdate))

                    expect(await CRUD.update({id: 'mockId', completed: true, text: 'newText'})).toEqual({
                        statusCode: 200,
                        data: {
                            response: fakeResponseUpdate
                        }
                    })
                })
            })

            describe("delete()", () => {
                it("should return the deleted element from the repository", async () => {
                    TodoRepositoryMock.deleteOne.mockImplementationOnce(() => Promise.resolve(fakeResponse))

                    expect(await CRUD.delete('mockId')).toEqual({
                        statusCode: 200,
                        data: {
                            response: fakeResponse
                        }
                    })
                })
            })
        });
    });
});