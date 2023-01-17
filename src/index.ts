import express from "express";
import { TodoCRUD } from "./crud/TodoCRUD";
import { TodoRepository } from "./repositories/TodoRepository";
import { Todo } from "./entities/mongo/mongoSchema";
import { connectDatabase } from "./connectDatabase";
import { TodoEntity } from "./entities/TodoEntity";
import { MongoDataStorage } from "./dataStorages/MongoDataStorage";
const cors = require('cors')


const app = express();
const PORT = 3005;

const REPOSITORY = new TodoRepository(
  new MongoDataStorage<TodoEntity>(Todo)
);

app.use(express.json());
app.use(cors())

app.get("/", async (req, res) => {
  res.send("Server Up!!!");
});

app.get("/todo", async (req, res) => {
  const todos = await new TodoCRUD(REPOSITORY).read();

  res.status(200).json(todos);
});

app.post("/todo", async (req, res) => {
  const { text } = req.body
  const insertNewTodo = await new TodoCRUD(REPOSITORY).create({text})
  res.status(200).json(insertNewTodo);
})

app.put("/todo/:id", async (req, res) => {
  const { id } = req.params;
  const { completed } = req.body
  
  const newValue = {id, completed}

  const updatedTodo = await new TodoCRUD(REPOSITORY).update(newValue);
  res.status(200).json(updatedTodo);
});

app.delete("/todo/:id", async (req, res) => {
  const { id } = req.params;
  const deletedTodo = await new TodoCRUD(REPOSITORY).delete(id)

  res.status(200).json(deletedTodo)
});

connectDatabase().then(
  app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
  })
).catch(err =>  console.error(err))


