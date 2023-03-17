import { UserRepository } from '../../../src/repositories/UserRepository';
import { MongooseDataStorageMock } from '../__mocks__/MongooseDataStorage.mock';
import { UserEntity } from '../../../src/entities/UserEntity';

describe('unit', () => {
    describe('respositories', () => {
        describe('UserRepository', () => {
            const dataStorageMock = new MongooseDataStorageMock<UserEntity>();
            const repository = new UserRepository(dataStorageMock);

            describe('getOneById()', () => {
                it('Should call findById() from the DataStorage', async () => {
                    dataStorageMock.findOneByKey.mockImplementationOnce(() =>
                        Promise.resolve({
                            username: 'testUsername',
                            password: 'testPassword123',
                            salt: "mockSalt",
                            id: 'mockId',
                        })
                    );

                    expect(await repository.getOneByKey({id: 'mockId'})).toEqual({
                        username: 'testUsername',
                        password: 'testPassword123',
                        salt: "mockSalt",
                        id: 'mockId',
                    });
                });
            });

            describe('insertOne()', () => {
                it('Should call create() from DataStorage', async () => {
                    dataStorageMock.create.mockImplementationOnce(() =>
                        Promise.resolve({
                            username: 'testUsername',
                            password: 'testPassword123',
                            salt: "mockSalt",
                            id: 'mockId',
                        })
                    );

                    expect(
                        await repository.insertOne({
                            username: 'testUsername',
                            password: 'testPassword123',
                            salt: "mockSalt"
                        })
                    ).toEqual({
                        username: 'testUsername',
                        password: 'testPassword123',
                        salt: "mockSalt",
                        id: 'mockId',
                    });
                });
            });
        });
    });
});
