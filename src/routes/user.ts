import express from 'express'
import { MongoDataStorage } from 'src/dataStorages/MongoDataStorage';
import { User } from 'src/entities/mongo/userSchema';
import { UserEntity } from 'src/entities/UserEntity';
import { UserRepository } from 'src/repositories/UserRepository';
import { UserCRUD } from 'src/crud/UserCRUD';
import { ValidCredentials } from 'src/utils/ValidCredentials';

const routes = express.Router()

const REPOSITORY = new UserRepository(new MongoDataStorage<UserEntity>(User))

routes.get('/', async (req, res) => {
    res.send("sono negli users")
})

routes.post('/signup', async (req, res) => {

    const { username, password } = req.body

    const credentials = await new ValidCredentials(username, password);

    if(!credentials.usernameCheck()){
        res.status(400).json({ message: "Username must have only alphanumeric chars and be 4-20 length" })
    }
    
    if(!credentials.passwordCheck){
        res.status(400).json({ message: "Password must be at least 6 length, and have 1 at least 1 number and 1 letter"})
    }

    res.status(200).json({ username: username, password: password })

})

export default routes;