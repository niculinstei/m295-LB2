const express = require('express');
const taskController = require('./controller/taskController');

const app = express;
const port = 3003;

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ extended: true }));
app.use(express.json());
app.use('/tasks', taskController);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
