
export interface ICRUD {
    read(): Promise<any>;
    create(newEllement: any): Promise<any>;
    update(updateElement: any): Promise<any>;
    delete(id: any): Promise<any>;
}