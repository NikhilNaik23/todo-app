const express = require("express");
const app = express();

app.use(express.json());

let todos = [];
let nextId = 1;

app.get("/healthz", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/todos", (req, res) => {
  res.json(todos);
});

app.post("/todos", (req, res) => {
  const title = ((req.body && req.body.title) || "").trim();
  if (!title) return res.status(400).json({ error: "title is required" });
  const todo = { id: nextId++, title, done: false };
  todos.push(todo);
  res.status(201).json(todo);
});

app.patch("/todos/:id", (req, res) => {
  const todo = todos.find((t) => t.id === Number(req.params.id));
  if (!todo) return res.status(404).json({ error: "not found" });
  if (typeof req.body.done === "boolean") todo.done = req.body.done;
  res.json(todo);
});

app.delete('/todos/:id', (req, res) => {
  const before = todos.length;
  todos = todos.filter((t) => t.id !== Number(req.params.id));
  if (todos.length === before) return res.status(404).json({ error: 'not found' });
  res.status(204).end();
});

module.exports = app;