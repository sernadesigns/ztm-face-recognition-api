const express = require('express');
const bcrypt = require('bcryptjs');
const cors = require('cors');

// create app instance
const app = express();

// middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

const database = {
  users: []
};

/**
 * GET requests
 */
app.get('/', (req, res) => {
  res.send(database.users);
});

app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  const [ user ] = database.users.filter(user => user.id === Number(id));
  if (user) {
    res.json(user);
  } else {
    res.status(404).json('no such user');
  }
});

/**
 * POST requests
 */
app.post('/signin', (req, res) => {
  const { email, password } = req.body;
  const userIndex = database.users.findIndex(user => user.email === email);

  bcrypt.compare(password, database.users[userIndex].hash, function(err, isRightPass) {
    if (isRightPass) {
      res.json(database.users[userIndex]);
    } else {
      res.status(400).json(err);
    }
  });
});

app.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  const id = database.users.length + 1;
  const hash = bcrypt.hashSync(password, 10);

  database.users.push({
    id,
    name,
    email,
    hash,
    entries: 0,
    joined: new Date()
  });
  res.json(...database.users.filter(user => user.id === id));
});

/**
 * PUT requests
 */
app.put('/image', (req, res) => {
  const { id } = req.body;
  const userIndex = database.users.findIndex(user => user.id === id);

  if (userIndex !== -1) {
    const user = database.users[userIndex];
    user.entries++;
    res.json(user.entries);
  } else {
    res.status(404).json('no such user');
  }
});

app.listen(3000, () => {
  console.log('app is running on port 3000');
});
