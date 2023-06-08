const express = require('express');
const session = require('express-session');
const taskController = require('./controller/taskController');
const authController = require('./controller/authController');

const app = express();
const port = 3003;

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ extended: true }));
app.use(express.json());
app.use(session({
  secret: 'supersecret',
  resave: false,
  saveUninitialized: false,
  cookie: {},
}));
app.use('/tasks', taskController);
app.use('/', authController);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
