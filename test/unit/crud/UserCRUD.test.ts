import { RepositoryMock } from '../__mocks__/Repository.mock';
import { UserEntity } from '../../../src/entities/UserEntity';
import { UserCRUD } from '../../../src/crud/UserCRUD';

describe('unit', () => {
    describe('crud', () => {
        describe('UserCRUD', () => {
            const UserRepositoryMock = new RepositoryMock<UserEntity>();
            const crud = new UserCRUD(UserRepositoryMock);

            describe('readOne()', () => {
                it('Should call getOneById() function from the UserRepository', async () => {
                    UserRepositoryMock.getOneByKey.mockImplementationOnce(() =>
                        Promise.resolve({
                            username: 'testUsername',
                            password: "testPassword123",
                            salt: "mockSalt",
                            id: 'mockId',
                        })
                    );

                    expect(await crud.readOne({id: 'mockId'})).toEqual({
                        statusCode: 200,
                        data: {
                            response: {
                                username: 'testUsername',
                                password: "testPassword123",
                                salt: "mockSalt",
                                id: 'mockId',
                            },
                        },
                    });
                });
            });

            describe('create()', () => {
                it('Should call inserOne() function from the UserRepository', async () => {
                    UserRepositoryMock.insertOne.mockImplementationOnce(() =>
                        Promise.resolve({
                            username: 'testUsername',
                            password: 'testPassword123',
                            salt: "mockSalt",
                            id: 'mockId',
                        })
                    );

                    expect(
                        await crud.create({
                            username: 'testUsername',
                            password: 'testPassword123',
                            salt: "mockSalt",
                        })
                    ).toEqual({
                        statusCode: 200,
                        data: {
                            response: {
                                username: 'testUsername',
                                password: "testPassword123",
                                salt: "mockSalt",
                                id: 'mockId',
                            }
                        }
                    });
                });
            });
        });
    });
});
