import { DataStorageId } from "src/dataStorages/IDataStorage";

export interface ICRUD {
    create(newObj: Object): Promise<Object>;
    read(): Promise<Object[]>;
    update(updateObj: Object): Promise<Object>;
    delete(id: DataStorageId): Promise<Object>;
}