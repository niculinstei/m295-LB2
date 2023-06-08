const express = require('express');
const session = require('express-session');

const router = express.Router();

router.use(express.urlencoded({ extended: true }));
router.use(express.json({ extended: true }));
router.use(session({
  secret: 'supersecret',
  resave: false,
  saveUninitialized: false,
  cookie: {},
}));

const listOfTasks = [
  {
    id: 1,
    title: 'LB B erstellen',
    createDate: '2023-04-12',
    finishedDate: '',
    author: 'banane@gurke.ch',
  },
  {
    id: 2,
    title: 'Meeting mit Kunden',
    createDate: '2023-05-05',
    finishedDate: '',
    author: 'Max Mustermann',
  },
  {
    id: 3,
    title: 'Dokumentation aktualisieren',
    createDate: '2023-05-15',
    finishedDate: '',
    author: 'banane@gurke.ch',
  },
  {
    id: 4,
    title: 'Code-Review durchführen',
    createDate: '2023-05-25',
    finishedDate: '',
    author: 'John Doe',
  },
  {
    id: 5,
    title: 'Unit-Tests schreiben',
    createDate: '2023-06-01',
    finishedDate: '',
    author: 'Jane Smith',
  },
];

function userIslogedIn(req) {
  if (!req.session.email || req.session.email == null) {
    return false;
  }
  return true;
}

function getActualDate() {
  const currentDate = new Date();

  const day = String(currentDate.getDate()).padStart(2, '0');
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const year = currentDate.getFullYear();

  // eslint-disable-next-line no-return-assign, no-undef
  return formattedDate = `${day}-${month}-${year}`;
}

function findTaskById(id, req) {
  return listOfTasks.filter((task) => task.author === req.session.email)
    .find((task) => task.id.toString() === id.toString());
}

function getCurrentId() {
  return listOfTasks.length + 1;
}

router.get('/', (req, res) => {
  if (!userIslogedIn(req)) {
    return res.status(401).json({ error: 'not logged in' });
  }
  return res.json(listOfTasks.filter((task) => task.author === req.session.email));
});

router.post('/', (req, res) => {
  if (!userIslogedIn(req)) {
    return res.status(401).json({ error: 'not logged in' });
  }
  const task = req.body;
  if (!task.title) {
    console.error('title can not be empty');
    return res.status(406).json({ error: 'title can not be empty' });
  }
  const taskToAdd = {
    id: getCurrentId(),
    title: task.title,
    createDate: getActualDate(),
    finishedDate: '',
    author: req.session.email,
  };
  listOfTasks.push(taskToAdd);
  console.log('task successfully added');
  return res.status(201).json(taskToAdd);
});

router.get('/:id', (req, res) => {
  if (!userIslogedIn(req)) {
    return res.status(401).json({ error: 'not logged in' });
  }
  const taskId = req.params.id;

  const task = findTaskById(taskId, req);

  if (!task) {
    return res.status(404).json({ error: 'task not found' });
  }
  return res.json(task);
});

router.put('/:id', (req, res) => {
  if (!userIslogedIn(req)) {
    return res.status(401).json({ error: 'not logged in' });
  }
  const taskId = req.params.id;
  const taskFromBody = req.body;
  const taskToReplace = findTaskById(taskId, req);
  if (!taskToReplace) {
    return res.status(404).json({ error: 'task not found' });
  } if (!taskFromBody.title) {
    console.error('title can not be empty');
    return res.status(406).json({ error: 'title can not be empty' });
  }
  const taskToSave = {
    id: taskToReplace.id,
    title: taskFromBody.title,
    createDate: taskToReplace.createDate,
    finishedDate: taskFromBody.finishedDate,
    author: taskToReplace.author,
  };
  const indexOfBook = listOfTasks.indexOf(taskToReplace);
  listOfTasks.splice(indexOfBook, 1, taskToSave);
  console.log('task edit success');
  return res.json(taskToSave);
});

router.delete('/:id', (req, res) => {
  if (!userIslogedIn(req)) {
    return res.status(401).json({ error: 'not logged in' });
  }
  const tastId = req.params.id;
  const task = findTaskById(tastId, req);

  if (!task) {
    return res.status(404).json({ error: 'task not found' });
  }
  const indexOfTask = listOfTasks.indexOf(task);
  listOfTasks.splice(indexOfTask, 1);
  return res.status(200).json(task);
});

module.exports = router;
