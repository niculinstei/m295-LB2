const express = require('express');
const session = require('express-session');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const YAML = require('yaml');
const authController = require('./controller/authController');
const taskController = require('./controller/taskController');

const app = express();
const port = 3003;
const file = fs.readFileSync('./taskApi/swagger.yaml', 'utf8');
const swaggerDocument = YAML.parse(file);

app.use(session({
  secret: 'supersecret',
  resave: false,
  saveUninitialized: false,
  cookie: {},
}));
app.use('/tasks', taskController);
app.use('/', authController);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
