import express from 'express';
import { authMiddleware } from '../Middlewares/authMiddleware';
import * as UserControllers from '../controllers/user'

const routes = express.Router()

routes.get('/findUser', authMiddleware, UserControllers.getUser)
routes.post('/signup', UserControllers.signup)
routes.post('/login', UserControllers.login)
routes.post('/admin/createGroupMember', authMiddleware, UserControllers.createGroupMember)


export default routes;