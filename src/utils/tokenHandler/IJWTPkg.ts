import { PayloadEntity } from "src/entities/PayloadEntity";

export interface IJWTPkg{
    singToken(payload: PayloadEntity, secret: string, expiresIn: string): string;
    verifyToken(token: string, secret: string);
}