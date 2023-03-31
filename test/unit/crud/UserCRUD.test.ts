import { RepositoryMock } from '../__mocks__/Repository.mock';
import { UserEntity } from '../../../src/entities/UserEntity';
import { UserCRUD } from '../../../src/crud/UserCRUD';

describe('unit', () => {
    describe('crud', () => {
        describe('UserCRUD', () => {
            const UserRepositoryMock = new RepositoryMock<UserEntity>();
            const crud = new UserCRUD(UserRepositoryMock);
            const mockUser = {
                username: "mockUsername", 
                password: "mockPassword123", 
                salt: "mockSalt", 
                id: "mockId"
            }

            describe('readOne()', () => {
                it('Should call getOneById() function from the UserRepository and return statusCode 200 with response obj', async () => {
                    UserRepositoryMock.getOneByKey.mockImplementationOnce(() =>
                        Promise.resolve(mockUser)
                    );

                    expect(await crud.readOne({id: "mockId"})).toEqual({ statusCode: 200, data: {
                            response: mockUser,
                        },
                    });
                });

                it('Should return statusCode 500 and Error.message when an error occour', async () => {
                    UserRepositoryMock.getOneByKey.mockImplementationOnce(() => { throw new Error("fake Error")});

                    expect(await crud.readOne({id: "mockId"})).toEqual({ statusCode: 500, data: { message: "fake Error" }});
                });

                it('Should return statusCode 500 and specific error.message when an unknown error occour', async () => {
                    UserRepositoryMock.getOneByKey.mockImplementationOnce(() => { throw undefined});

                    expect(await crud.readOne({id: "mockId"})).toEqual({ statusCode: 500, data: { message: "An unknown error occured" }});
                });
            });

            describe('create()', () => {
                it('Should return statusCode 200 and call inserOne() function from the UserRepository with response obj', async () => {
                    UserRepositoryMock.insertOne.mockImplementationOnce(() =>
                        Promise.resolve(mockUser)
                    );

                    expect(await crud.create({ username: "mockUsername", password: "mockPassword123", salt: "mockSalt" })).toEqual({
                        statusCode: 200,
                        data: {
                            response: mockUser
                        }
                    });
                });

                it('Should return statusCode 500 and Error.message if an Error occour', async () => {
                    UserRepositoryMock.insertOne.mockImplementationOnce(() => { throw new Error("fake Error")}
                    );

                    expect(await crud.create({ username: "mockUsername", password: "mockPassword123", salt: "mockSalt" })).toEqual({
                        statusCode: 500,
                        data: {
                            message: "fake Error"
                        }
                    });
                });

                it('Should return statusCode 500 and specific error.message if an unknown error occour', async () => {
                    UserRepositoryMock.insertOne.mockImplementationOnce(() => { throw undefined });

                    expect(await crud.create({ username: "mockUsername", password: "mockPassword123", salt: "mockSalt" })).toEqual({
                        statusCode: 500,
                        data: {
                            message: "An unknown error occured"
                        }
                    });
                });
            });
        });
    });
});
