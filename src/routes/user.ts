import express from 'express'
import { MongoDataStorage } from '../dataStorages/MongoDataStorage';
import { User } from '../entities/mongo/userSchema';
import { UserEntity } from '../entities/UserEntity';
import { UserRepository } from '../repositories/UserRepository';
import { UserCRUD } from '../crud/UserCRUD';
import { ValidCredentials } from '../utils/verifyCredentials/ValidCredentials';
import { CryptoPasswordHandler } from '../utils/cryptPassword/CryptoPasswordHandler';
import { PasswordHandler } from '../utils/cryptPassword/PasswordHandler';
import { JWTHandler } from '../utils/tokenHandler/JWTHandler';
import { JsonWebTokenPkg } from '../utils/tokenHandler/JsonWebTokenPkg';
import { secret } from '../index'
import { authMiddleware } from '../utils/authMiddleware';

const routes = express.Router()

const REPOSITORY = new UserRepository(new MongoDataStorage<UserEntity>(User))

routes.get('/findUser', authMiddleware, async (req, res) => {
    const userId = req.userId

    const user = await new UserCRUD(REPOSITORY).readOne({id: userId})

    res.status(user.statusCode).json(user.data)
})

routes.post('/signup', async (req, res, next) => {

    const { username, password } = req.body

    const credentials = new ValidCredentials(username, password);

    const validUsername = credentials.usernameCheck()
    const validPassword = credentials.passwordCheck()

    if(!validUsername){
        return res.status(400).json({ message: "Username must have only alphanumeric chars and be 4-20 length" })
    }
    if(!validPassword){
        return res.status(400).json({ message: "Password must be at least 6 length, and have at least 1 number and 1 letter"})
    }

    const findExistingUser = await new UserCRUD(REPOSITORY).readOne({username: username})

    if('response' in findExistingUser.data){
        return res.status(400).json({ message: "This user already exist" })
    }

    const cryptoObj = new PasswordHandler(new CryptoPasswordHandler()).cryptPassword(password)

    const newUser = await new UserCRUD(REPOSITORY).create({
        username: username,
        password: cryptoObj.hashPassword,
        salt: cryptoObj.salt
    })

    if('response' in newUser.data){
        const user = newUser.data.response

        const jwt = new JWTHandler(new JsonWebTokenPkg()).issueJWT(user, secret)

        return res.status(200).json({ user: user, token: jwt.token, expireIn: jwt.expires})

    } else {
        return res.status(400).json({ message: "Error while trying to create user"})
    }
})

routes.post('/login', async (req, res, next) => {
    const { username, password } = req.body

    const userInDb = await new UserCRUD(REPOSITORY).readOne({username: username})

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
})


export default routes;