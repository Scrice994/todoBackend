import { IEntity } from "src/entities/IEntity";

export interface ICRUD<T extends IEntity>{
    read(): Promise<Required<T[]>>;
    create(newEllement: T): Promise<Required<T>>;
    update(updateElement: Required<IEntity> & Partial<T>): Promise<Required<T>>;
    delete(id: Required<IEntity>): Promise<Required<T>>;
}