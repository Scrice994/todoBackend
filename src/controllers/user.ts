import { RequestHandler } from "express";
import { ICRUDResponse } from 'src/crud/ICRUD';
import { UserCRUD } from '../crud/UserCRUD';
import { MongoDataStorage } from '../dataStorages/MongoDataStorage';
import { UserEntity } from '../entities/UserEntity';
import { User } from '../entities/mongo/userSchema';
import { secret } from '../index';
import { UserRepository } from '../repositories/UserRepository';
import { CryptoPasswordHandler } from '../utils/cryptPassword/CryptoPasswordHandler';
import { PasswordHandler } from '../utils/cryptPassword/PasswordHandler';
import { JWTHandler } from '../utils/tokenHandler/JWTHandler/JWTHandler';
import { JsonWebTokenPkg } from '../utils/tokenHandler/JsonWebTokenPkg/JsonWebTokenPkg';

const USER_DATA_STORAGE = new MongoDataStorage<UserEntity>(User)
const USER_REPOSITORY = new UserRepository(USER_DATA_STORAGE)
const USER_CRUD = new UserCRUD(USER_REPOSITORY)

export const getUser: RequestHandler = async (req, res) => {
    const userId = req.userId

    const user = await USER_CRUD.readOne({id: userId})

    res.status(user.statusCode).json(user.data)
}

export const signup: RequestHandler = async (req, res) => {

    const { username, password, groupName } = req.body

    const findExistingUser = await USER_CRUD.readOne({username: username})
    if('response' in findExistingUser.data){
        return res.status(400).json({ message: "This user already exist" })
    }

    const findExistingGroup = await USER_CRUD.readOne({ tenantId: groupName })
    if('response' in findExistingGroup.data){
        return res.status(400).json({ message: "This group name already exist"})
    }

    let newUser: ICRUDResponse<UserEntity>;

    if(groupName){
        newUser = await USER_CRUD.create({
            username: username,
            password: password,
            userRole: 'Admin',
            tenantId: groupName
        })
    } else {
        newUser = await USER_CRUD.create({
            username: username,
            password: password,
            userRole: 'Admin'
        })
    }

    if('response' in newUser.data){
        const user = newUser.data.response

        const jwt = new JWTHandler(new JsonWebTokenPkg()).issueJWT(user, secret)

        return res.status(200).json({ user: user, token: jwt.token, expireIn: jwt.expires})
    }

    return res.status(newUser.statusCode).json(newUser.data)
}

export const login: RequestHandler =  async (req, res) => {
    const { username, password } = req.body

    const userInDb = await USER_CRUD.readOne({username: username})

    if('response' in userInDb.data){
       const user = userInDb.data.response

       const passwordVerification = new PasswordHandler(new CryptoPasswordHandler()).checkPassword(password, user.password, user.salt)

        if(!passwordVerification){
            return res.status(401).json({ message: "Wrong credentials" })
        }

        const jwt = new JWTHandler(new JsonWebTokenPkg()).issueJWT(user, secret)

        return res.status(200).json({ user: user, token: jwt.token, expireIn: jwt.expires })

    } else {
        return res.status(401).json({ message: "Wrong credentials" })
    }
}

export const createGroupMember: RequestHandler = async (req, res) => {

    const userId = req.userId

    const findUser = await USER_CRUD.readOne({id: userId})

    if('response' in findUser.data){
        if(findUser.data.response.userRole === 'Admin' && findUser.data.response.tenantId){
            const { username, password } = req.body
        
            const findExistingUser = await USER_CRUD.readOne({username: username})
            if('response' in findExistingUser.data){
                return res.status(400).json({ message: "This user already exist" })
            }

            const newUser = await USER_CRUD.create({
                username: username,
                password: password,
                userRole: 'Member',
                tenantId: findUser.data.response.tenantId
            })

            if('response' in newUser.data){
                return res.status(200).json({ success: "User created successfully" })
            }

            return res.status(newUser.statusCode).json(newUser.data)
        }
        return res.status(403).json({ message: "you are not Authorized" })
    }
    
    return res.status(404).json({ message: "User not found" })
}