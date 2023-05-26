import { RequestHandler } from "express";
import { TodoCRUD } from '../crud/TodoCRUD';
import { MongoDataStorage } from '../dataStorages/MongoDataStorage';
import { TodoEntity } from '../entities/TodoEntity';
import { Todo } from '../entities/mongo/todoSchema';
import { TodoRepository } from '../repositories/TodoRepository';
import { EventEmitter } from "../utils/EventEmitter/EventEmitter";
import { HttpClient } from "../utils/HttpClient/HttpClient";

const TODO_DATA_STORAGE = new MongoDataStorage<TodoEntity>(Todo)
const TODO_REPOSITORY = new TodoRepository(TODO_DATA_STORAGE);
const TODO_CRUD = new TodoCRUD(TODO_REPOSITORY)

const httpClient = new HttpClient()
export const EVENT = new EventEmitter(httpClient)

export const getTodos: RequestHandler = async (req, res) => {
    const todos = await TODO_CRUD.read({userId: req.userId});

    res.status(todos.statusCode).json(todos.data);
}

export const NewTodo: RequestHandler = async (req, res) => {
    const { text } = req.body;
    const userId = req.userId
    const tenantId = req.tenantId

    const insertNewTodo = await TODO_CRUD.create({text, userId});

    if('response' in insertNewTodo.data){
        const newTodo = insertNewTodo.data.response
        await EVENT.sendEvent('newTodo', { ...newTodo, tenantId })
    }

    res.status(insertNewTodo.statusCode).json(insertNewTodo.data);
}

export const UpdateTodo: RequestHandler = async (req, res) => {
    const { id } = req.params;
    const { completed } = req.body;
    const tenantId = req.tenantId
    
    const newValue = { id, completed };

    const updatedTodo = await TODO_CRUD.update(newValue);

    if('response' in updatedTodo.data){
        const updatedData = updatedTodo.data.response

        await EVENT.sendEvent('updateTodo', { ...updatedData, tenantId })
    }

    res.status(updatedTodo.statusCode).json(updatedTodo.data);
}

export const DeleteAllTodo: RequestHandler =  async (req, res) => {
    const userId = req.userId
    const tenantId = req.tenantId
    const findTodos = await TODO_CRUD.read({ userId })
    const deletedElements = await TODO_CRUD.deleteAll({ userId })

    if('response' in findTodos.data){
        const deletedTodos = findTodos.data.response

        if('response' in deletedElements.data){
            const NumberOfDeletedTodos = deletedElements.data.response

            if(deletedTodos.length === NumberOfDeletedTodos){
                await EVENT.sendEvent('deleteAllTodos', { deletedTodos, userId, tenantId })
            }
        }
    }

    res.status(deletedElements.statusCode).json(findTodos.data)
}

export const DeleteTodo: RequestHandler = async (req, res) => {
    const { id } = req.params;
    const tenantId = req.tenantId
    const deletedTodo = await TODO_CRUD.delete(id);

    if('response' in deletedTodo.data){
        const deletedData = deletedTodo.data.response

        await EVENT.sendEvent('deleteTodo', { ...deletedData, tenantId })
    }

    res.status(deletedTodo.statusCode).json(deletedTodo.data);
}