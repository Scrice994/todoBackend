import { RepositoryMock } from '../__mocks__/Repository.mock';
import { UserEntity } from '../../../src/entities/UserEntity';
import { UserCRUD } from '../../../src/crud/UserCRUD';

describe('unit', () => {
    describe('UserCRUD', () => {
        const UserRepositoryMock = new RepositoryMock<UserEntity>();
        const crud = new UserCRUD(UserRepositoryMock);
        const mockUser = {
            username: "mockUsername", 
            password: "mockPassword123", 
            salt: "mockSalt", 
            id: "mockId",
            userRole: 'mockRole'
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
                expect(await crud.create({ username: "mockUsername", password: "mockPassword123", userRole: 'mockRole' })).toEqual({
                    statusCode: 200,
                    data: {
                        response: mockUser
                    }
                });
            });

            it("should return statusCode 404 and errorMessage when username is not provided", async () => {
                const createUser = await crud.create({ username: '', password: 'mockPassword123', userRole: 'Member' })

                expect(createUser).toEqual({
                    statusCode: 404,
                    data: {
                        message: 'Missing required @parameter username'
                    }
                })
            });

            it("should return statusCode 404 and errorMessage when password is not provided", async () => {
                const createUser = await crud.create({ username: 'testUsername', password: '', userRole: 'Member' })

                expect(createUser).toEqual({
                    statusCode: 404,
                    data: {
                    message: 'Missing required @parameter password'
                }})
            });

            it("should return statusCode 404 and errorMessage when invalid username is provided", async () => {
                const createUser = await crud.create({ username: 'asd', password: 'testPassword123', userRole: 'Member' })

                expect(createUser).toEqual({
                    statusCode: 404,
                    data: {
                    message: 'Invalid @parameter username'
                }})
            });

            it("should return statusCode 404 and errorMessage when invalid password is provided", async () => {
                const createUser = await crud.create({ username: 'testUsername', password: 'testPassword', userRole: 'Member' })

                expect(createUser).toEqual({
                    statusCode: 404,
                    data: {
                    message: 'Invalid @parameter password'
                }})
            });

            it('Should return statusCode 500 and Error.message if an Error occour', async () => {
                UserRepositoryMock.insertOne.mockImplementationOnce(() => { throw new Error("fake Error")});

                expect(await crud.create({ username: "mockUsername", password: "mockPassword123", userRole: 'mockRole' })).toEqual({
                    statusCode: 500,
                    data: {
                        message: "fake Error"
                    }
                });
            });

            it('Should return statusCode 500 and specific error.message if an unknown error occour', async () => {
                UserRepositoryMock.insertOne.mockImplementationOnce(() => { throw undefined });
                expect(await crud.create({ username: "mockUsername", password: "mockPassword123", userRole: 'mockRole' })).toEqual({
                    statusCode: 500,
                    data: {
                        message: "An unknown error occured"
                    }
                });
            });
        });
    });
});
