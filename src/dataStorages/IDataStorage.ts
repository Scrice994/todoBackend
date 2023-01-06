export interface IDataStorage<T> {
    find(): Promise<T[]>;
    // create();
    // update();
    // delete();
}