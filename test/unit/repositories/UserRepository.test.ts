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
                    dataStorageMock.findById.mockImplementationOnce(() =>
                        Promise.resolve({
                            username: 'testUsername',
                            hash: 'mockHash',
                            salt: 'mockSalt',
                            id: 'mockId',
                        })
                    );

                    expect(await repository.getOneById('mockId')).toEqual({
                        username: 'testUsername',
                        hash: 'mockHash',
                        salt: 'mockSalt',
                        id: 'mockId',
                    });
                });
            });

            describe('insertOne()', () => {
                it('Should call create() from DataStorage', async () => {
                    dataStorageMock.create.mockImplementationOnce(() =>
                        Promise.resolve({
                            username: 'testUsername',
                            hash: 'mockHash',
                            salt: 'mockSalt',
                            id: 'mockId',
                        })
                    );

                    expect(
                        await repository.insertOne({
                            username: 'testUsername',
                            hash: 'mockHash',
                            salt: 'mockSalt',
                        })
                    ).toEqual({
                        username: 'testUsername',
                        hash: 'mockHash',
                        salt: 'mockSalt',
                        id: 'mockId',
                    });
                });
            });
        });
    });
});
