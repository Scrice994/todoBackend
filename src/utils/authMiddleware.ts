import { JWTHandler } from '../utils/tokenHandler/JWTHandler';
import { JsonWebTokenPkg } from '../utils/tokenHandler/JsonWebTokenPkg';
import { secret } from '../index';
import { NextFunction, Request, Response } from 'express';

export interface Ipayload{
    sub: string,
    iat: number,
    exp: number
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    if(req.headers.authorization){
        const tokenParts = req.headers.authorization.split(' ')

        if(tokenParts[0] === 'Bearer' && tokenParts[1].match(/\S+\.\S+\.\S+/) !== null){
            try {
                const payload = new JWTHandler(new JsonWebTokenPkg()).checkJWT(tokenParts[1], secret) as Ipayload
                req.userId = payload.sub
                next()
            } catch (error) {
                res.status(401).json({ message: 'invalid Token'})
            }

        } else res.status(401).json({ message: 'You are not Authorized to this route' }) 
    } else res.status(401).json({ message: 'You are not Authorized to this route' }) 
}