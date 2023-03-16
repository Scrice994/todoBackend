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
                    UserRepositoryMock.getOneById.mockImplementationOnce(() =>
                        Promise.resolve({
                            username: 'testUsername',
                            hash: 'mockHash',
                            salt: 'mockSalt',
                            id: 'mockId',
                        })
                    );

                    expect(await crud.readOne('mockId')).toEqual({
                        statusCode: 200,
                        data: {
                            response: {
                                username: 'testUsername',
                                hash: 'mockHash',
                                salt: 'mockSalt',
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
                            hash: 'mockHash',
                            salt: 'mockSalt',
                            id: 'mockId',
                        })
                    );

                    expect(
                        await crud.create({
                            username: 'testUsername',
                            hash: 'mockHash',
                            salt: 'mockSalt',
                        })
                    ).toEqual({
                        statusCode: 200,
                        data: {
                            response: {
                                username: 'testUsername',
                                hash: 'mockHash',
                                salt: 'mockSalt',
                                id: 'mockId',
                            }
                        }
                    });
                });
            });
        });
    });
});
