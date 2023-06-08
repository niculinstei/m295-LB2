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

const secretAdminCredentials = { password: 'm295' };

router.post('/login', (request, response) => {
  const { email, password } = request.body;

  if (password === secretAdminCredentials.password) {
    request.session.email = email;
    return response.status(200).json({ email: request.session.email });
  }
  return response.status(401).json({ error: 'Invalid credentials' });
});

router.delete('/logout', (request, response) => {
  if (request.session.email) {
    request.session.destroy();
    response.sendStatus(204);
  } else {
    response.status(401).json({ error: 'Not logged in' });
  }
});

router.get('/verify', (request, response) => {
  if (request.session.email) {
    return response.status(200).json({ email: request.session.email });
  }

  return response.status(401).json({ error: 'Not logged in' });
});

module.exports = router;
