import express from "express";
import { TodoCRUD } from "./crud/TodoCRUD";
import { TodoRepository } from "./repositories/TodoRepository";
import { Todo } from "./entities/mongo/mongoSchema";
import { connectDatabase } from "./connectDatabase";
import { TodoEntity } from "./entities/TodoEntity";
import { MongoDataStorage } from "./dataStorages/MongoDataStorage";
const cors = require('cors')


const app = express();
const port = 3005;

const repository = new TodoRepository(
  new MongoDataStorage<TodoEntity>(Todo)
);

app.use(express.json());
app.use(cors())

app.get("/", async (req, res) => {
  res.send("Server Up!!!");
});

app.get("/todo", async (req, res) => {
  const todos = await new TodoCRUD(repository).read();

  res.status(200).json(todos);
});

// app.post("/todo", async (req, res) => {
//   const { text } = req.body

//   const insertNewTodo = await new TodoCRUD(repository).create(text);

//   res.status(200).json({text: insertNewTodo.text, completed: insertNewTodo.completed, id: insertNewTodo.id});
// })

// app.put("/todo/:id", async (req, res) => {
//   const { id } = req.params;
//   const { completed } = req.body
//   const newValue = completed
 
//   const updatedTodo = await new TodoCRUD(repository).update(id, newValue);

//   res.status(200).json({text: updatedTodo.text, completed: updatedTodo.completed, id: updatedTodo.id});
// });

// app.delete("/todo/:id", async (req, res) => {
//   const { id } = req.params;
//   const deletedTodo = await new TodoCRUD(repository).delete(id)

//   res.status(200).json({text: deletedTodo.text, completed: deletedTodo.completed, id: deletedTodo.id})
// });

connectDatabase().then(
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  })
).catch(err =>  console.error(err))


