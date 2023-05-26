import express from "express";
import { authMiddleware } from "../Middlewares/authMiddleware";
import * as TodoControllers from "../controllers/todo";

const routes = express.Router()
routes.use(authMiddleware);

routes.get('/', TodoControllers.getTodos);
routes.post('/', TodoControllers.NewTodo);
routes.put('/:id', TodoControllers.UpdateTodo);
routes.delete('/deleteAll', TodoControllers.DeleteAllTodo)
routes.delete('/:id', TodoControllers.DeleteTodo);

export default routes;