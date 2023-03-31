import { RepositoryMock } from '../__mocks__/Repository.mock';
import { TodoEntity } from '../../../src/entities/TodoEntity';
import { TodoCRUD } from '../../../src/crud/TodoCRUD';

describe('unit', () => {
    describe('crud', () => {
        describe('TodoCRUD', () => {
            const TodoRepositoryMock = new RepositoryMock<TodoEntity>();
            const CRUD = new TodoCRUD(TodoRepositoryMock);
            const fakeResponse = {
                text: 'mockText',
                completed: false,
                userId: 'mockUserId',
                id: 'mockId',
            };
            const fakeResponseUpdate = {
                text: 'newText',
                completed: true,
                userId: 'mockUserId',
                id: 'mockId',
            };
            const errorResponse = {
                statusCode: 500,
                data: {
                    message: 'Fake Error',
                },
            };
            const unknownErrorResponse = {
                statusCode: 500,
                data: {
                    message: "An unknown error occured"
                }
            };

            describe('read()', () => {
                it('Should statusCode 200 and call getAll() from the repository', async () => {
                    TodoRepositoryMock.getAll.mockImplementationOnce(() =>
                        Promise.resolve([fakeResponse])
                    );

                    expect(await CRUD.read({userId: 'mockUserId'})).toEqual({
                        statusCode: 200,
                        data: {
                            response: [fakeResponse],
                        },
                    });
                });

                it('Should return statusCode 404 and error.message when obj parameter is not provided', async () => {
                    const response = await CRUD.read(JSON.parse(JSON.stringify('')))

                    expect(response).toEqual({
                        statusCode: 404,
                        data: {
                            message: 'Missing required @parameter filter obj',
                        },
                    });
                });


                it('Should return statusCode 500 and error.message when error occurs', async () => {
                    TodoRepositoryMock.getAll.mockImplementationOnce(() => {
                        throw new Error("Fake Error");
                    });

                    expect(await CRUD.read({userId: 'mockUserId'})).toEqual(errorResponse);
                });

                it('Should return statusCode 500 and error.message when unknown error occurs', async () => {
                    TodoRepositoryMock.getAll.mockImplementationOnce(() => {
                        throw undefined;
                    });

                    expect(await CRUD.read({userId: 'mockUserId'})).toEqual(unknownErrorResponse);
                });
            });

            describe('create()', () => {
                it('Should return statusCode 200 and call insertOne() from the repository', async () => {
                    TodoRepositoryMock.insertOne.mockImplementationOnce(() =>
                        Promise.resolve(fakeResponse)
                    );

                    expect(await CRUD.create({ text: 'mockText', userId: 'mockUserId' })).toEqual({
                        statusCode: 200,
                        data: {
                            response: fakeResponse,
                        },
                    });
                });

                it('Should return statusCode 404 and specific error.message when text parameter is not provided', async () => {
                    const response = await CRUD.create(
                        JSON.parse(JSON.stringify({ userId: 'mockUserId' }))
                    );

                    expect(response).toEqual({
                        statusCode: 404,
                        data: {
                            message: 'Missing required @parameter text',
                        },
                    });
                });

                it('Should return statusCode 404 and specific error.message when userId parameter is not provided', async () => {
                    const response = await CRUD.create(
                        JSON.parse(JSON.stringify({ text: 'mockText' }))
                    );

                    expect(response).toEqual({
                        statusCode: 404,
                        data: {
                            message: 'Missing required @parameter userId',
                        },
                    });
                });

                it('Should return statusCode 500 and error.message when an error occurs', async () => {
                    TodoRepositoryMock.insertOne.mockImplementationOnce(() => {
                        throw new Error("Fake Error");
                    });

                    expect(await CRUD.create({ text: 'mockText', userId: 'mockUserId' })).toEqual(errorResponse);
                });

                it('Should return statusCode 500 and error.message when an unknown error occurs', async () => {
                    TodoRepositoryMock.insertOne.mockImplementationOnce(() => { throw undefined });

                    expect(await CRUD.create({ text: 'mockText', userId: 'mockUserId' })).toEqual(unknownErrorResponse);
                });
            });

            describe('update()', () => {
                it('should return statusCode 200 and call updateOne() from the repository', async () => {
                    TodoRepositoryMock.updateOne.mockImplementationOnce(() =>
                        Promise.resolve(fakeResponseUpdate)
                    );

                    expect(await CRUD.update({ id: 'mockId', completed: true, text: 'newText' })).toEqual({
                        statusCode: 200,
                        data: {
                            response: fakeResponseUpdate,
                        },
                    });
                });

                it('should return statusCode 404 Aand message.error if id is not provided', async () => {
                    const response = await CRUD.update(JSON.parse(JSON.stringify({ text: 'sampleText', completed: true })));

                    expect(response).toEqual({
                        statusCode: 404,
                        data: { message: 'Missing or invalid required @parameter id' }
                    });
                });

                it('Should return statusCode 500 and error.message when an error occurs', async () => {
                    TodoRepositoryMock.updateOne.mockImplementationOnce(() => { throw new Error("Fake Error")});

                    expect(await CRUD.update({ id: 'mockId', completed: true, text: 'newText' })).toEqual(errorResponse);
                });

                it('Should return statusCode 500 and specific error.message when an unknown error occurs', async () => {
                    TodoRepositoryMock.updateOne.mockImplementationOnce(() => { throw undefined});

                    expect(await CRUD.update({ id: 'mockId', completed: true, text: 'newText' })).toEqual(unknownErrorResponse);
                });
            });

            describe('delete()', () => {
                it('should return statusCode 200 and call deleteOne() from the repository', async () => {
                    TodoRepositoryMock.deleteOne.mockImplementationOnce(() => Promise.resolve(fakeResponse));

                    expect(await CRUD.delete('mockId')).toEqual({
                        statusCode: 200,
                        data: {
                            response: fakeResponse,
                        },
                    });
                });

                it('should return statusCode 404 and messsage.error if id is not provided', async () => {
                    const response = await CRUD.delete( JSON.parse(JSON.stringify('')));

                    expect(response).toEqual({
                        statusCode: 404,
                        data: { message: 'Missing or invalid required @parameter id' }
                    });
                });

                it('Should return statusCode 400 and error.message when an error occurs', async () => {
                    TodoRepositoryMock.deleteOne.mockImplementationOnce(() => { throw new Error("Fake Error")});

                    expect(await CRUD.delete('mockId')).toEqual(errorResponse);
                });

                it('Should return statusCode 400 and error.message when an unknown error occurs', async () => {
                    TodoRepositoryMock.deleteOne.mockImplementationOnce(() => { throw undefined});

                    expect(await CRUD.delete('mockId')).toEqual(unknownErrorResponse);
                });
            });
            
            describe("deleteAll()", () => {
                it("should return statusCode 200 and call deleteAll() from the repository", async () => {
                    TodoRepositoryMock.deleteAll.mockImplementationOnce(() => Promise.resolve(2));

                    expect(await CRUD.deleteAll({ userId: 'mockUserId' })).toEqual({
                        statusCode: 200,
                        data: {
                            response: 2,
                        },
                    });
                })
                
                it("should return statusCode 404 and specif error.message when obj.filter is not provided", async () => {
                    const response = await CRUD.deleteAll(JSON.parse(JSON.stringify('')))

                    expect(response).toEqual({
                        statusCode: 404,
                        data: {
                            message: 'Missing required @parameter filter obj',
                        },
                    });
                })    

                it("should return statusCode 400 and error.message when an error occour", async () => {
                    TodoRepositoryMock.deleteAll.mockImplementationOnce(() => { throw new Error("Fake Error") });

                    expect(await CRUD.deleteAll({userId: 'mockUserId'})).toEqual(errorResponse);
                })    

                it("should return statusCode 400 and specific error.message when a unknown error occour", async () => {
                    TodoRepositoryMock.deleteAll.mockImplementationOnce(() => { throw undefined });

                    expect(await CRUD.deleteAll({userId: 'mockUserId'})).toEqual(unknownErrorResponse);
                })    
            })
        });
    });
});
