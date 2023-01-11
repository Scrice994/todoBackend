export interface IDataStorage<T> {
    find(): Promise<T[]>;
    create(newTodo: string): Promise<any>;
    update(id: string | number, newValue: boolean): Promise<any>;
    delete(id: string | number): Promise<any>;
}