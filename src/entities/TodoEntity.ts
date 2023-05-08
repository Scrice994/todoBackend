import { IEntity } from "./IEntity";

export interface TodoEntity extends IEntity {
    text: string;
    completed?: boolean;
    userId: string;
    tenantId?: string;
}
