import { IJWTEntity } from "../../entities/IJWTEntity";
import { ITokenPayloadEntity } from "../../entities/ITokenPayloadEntity";
import { UserEntity } from "../../entities/UserEntity";

export interface IJWTHandler{
    issueJWT(user: UserEntity, secret: string): IJWTEntity;
    checkJWT(token: string, secret: string): ITokenPayloadEntity;
}