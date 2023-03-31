import express,{ Request, Response } from "express";
import { TodoCRUD } from '../crud/TodoCRUD';
import { TodoRepository } from '../repositories/TodoRepository';
import { Todo } from '../entities/mongo/todoSchema';
import { TodoEntity } from '../entities/TodoEntity';
import { MongoDataStorage } from '../dataStorages/MongoDataStorage';
import { authMiddleware } from "../utils/authMiddleware";

const routes = express.Router()

const REPOSITORY = new TodoRepository(new MongoDataStorage<TodoEntity>(Todo));
routes.use(authMiddleware);

routes.get('/', async (req: Request, res: Response) => {
    const todos = await new TodoCRUD(REPOSITORY).read({userId: req.userId});

    res.status(todos.statusCode).json(todos.data);
});

routes.post('/', async (req, res) => {
    const { text } = req.body;
    const userId = req.userId
    const insertNewTodo = await new TodoCRUD(REPOSITORY).create({text, userId});

    res.status(insertNewTodo.statusCode).json(insertNewTodo.data);
});

routes.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { completed } = req.body;

    const newValue = { id, completed };

    const updatedTodo = await new TodoCRUD(REPOSITORY).update(newValue);

    res.status(updatedTodo.statusCode).json(updatedTodo.data);
});

routes.delete('/deleteAll', async (req, res) => {
    const userId = req.userId
    const deletedTodos = await new TodoCRUD(REPOSITORY).deleteAll({userId})

    res.status(deletedTodos.statusCode).json(deletedTodos.data)
})

routes.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const deletedTodo = await new TodoCRUD(REPOSITORY).delete(id);

    res.status(deletedTodo.statusCode).json(deletedTodo.data);
});

export default routes;