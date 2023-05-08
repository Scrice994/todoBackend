import express, { Request, Response } from "express";
import { TodoCRUD } from '../crud/TodoCRUD';
import { MongoDataStorage } from '../dataStorages/MongoDataStorage';
import { TodoEntity } from '../entities/TodoEntity';
import { Todo } from '../entities/mongo/todoSchema';
import { TodoRepository } from '../repositories/TodoRepository';
import { EventEmitter } from "../utils/EventEmitter";
import { HttpClient } from "../utils/HttpClient";
import { authMiddleware } from "../utils/authMiddleware";

const routes = express.Router()

const REPOSITORY = new TodoRepository(new MongoDataStorage<TodoEntity>(Todo));
const httpClient = new HttpClient()
export const EVENT = new EventEmitter(httpClient)

routes.use(authMiddleware);

routes.get('/', async (req: Request, res: Response) => {
    const todos = await new TodoCRUD(REPOSITORY).read({userId: req.userId});

    res.status(todos.statusCode).json(todos.data);
});

routes.post('/', async (req, res) => {
    const { text } = req.body;
    const userId = req.userId
    const tenantId = req.tenantId

    const insertNewTodo = await new TodoCRUD(REPOSITORY).create({text, userId});

    if('response' in insertNewTodo.data){
        const newTodo = insertNewTodo.data.response
        await EVENT.sendEvent('newTodo', { ...newTodo, tenantId })
    }

    res.status(insertNewTodo.statusCode).json(insertNewTodo.data);
});

routes.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { completed } = req.body;
    const tenantId = req.tenantId
    
    const newValue = { id, completed };

    const updatedTodo = await new TodoCRUD(REPOSITORY).update(newValue);

    if('response' in updatedTodo.data){
        const updatedData = updatedTodo.data.response

        await EVENT.sendEvent('updateTodo', { ...updatedData, tenantId })
    }

    res.status(updatedTodo.statusCode).json(updatedTodo.data);
});

routes.delete('/deleteAll', async (req, res) => {
    const userId = req.userId
    const tenantId = req.tenantId
    const findTodos = await new TodoCRUD(REPOSITORY).read({ userId })
    const deletedElements = await new TodoCRUD(REPOSITORY).deleteAll({ userId })

    if('response' in findTodos.data){
        const deletedTodos = findTodos.data.response

        if('response' in deletedElements.data){
            const NumberOfDeletedTodos = deletedElements.data.response

            if(deletedTodos.length === NumberOfDeletedTodos){
                await EVENT.sendEvent('deletedAllTodos', { deletedTodos, userId, tenantId })
            }
        }
    }


    res.status(deletedElements.statusCode).json(findTodos.data)
})

routes.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const tenantId = req.tenantId
    const deletedTodo = await new TodoCRUD(REPOSITORY).delete(id);

    if('response' in deletedTodo.data){
        const deletedData = deletedTodo.data.response

        await EVENT.sendEvent('deletedTodo', { ...deletedData, tenantId })
    }

    res.status(deletedTodo.statusCode).json(deletedTodo.data);
});

export default routes;