const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const app = express();

// Middleware - parse body
app.use(bodyParser.json());

// Allow cross origin requests
app.use(cors());

// Test database
const database = {
  users: [
    {
      id: '123',
      name: 'John',
      email: 'john@gmail.com',
      password: 'cookies',
      entries: 0,
      joined: new Date(),
    },
    {
      id: '124',
      name: 'Sally',
      email: 'sally@gmail.com',
      password: 'bananas',
      entries: 0,
      joined: new Date(),
    },
  ],
};

// Homepage
app.get('/', (req, res) => {
  res.send(database.users);
});

// Signin
app.post('/signin', (req, res) => {
  if (
    req.body.email === database.users[0].email &&
    req.body.password == database.users[0].password
  ) {
    res.json(database.users[0]);
  } else {
    res.status(400).json('Server response: invalid signin');
  }
});

// Register
app.post('/register', (req, res) => {
  const {email, name, password} = req.body;
  bcrypt.hash(password, null, null, function(err, hash) {
    console.log(hash);
  });
  database.users.push({
    id: '125',
    name: name,
    email: email,
    password: password,
    entries: 0,
    joined: new Date(),
  });
  res.json(database.users[database.users.length - 1]);
});

// Profile
app.get('/profile/:id', (req, res) => {
  const {id} = req.params;
  let found = false;
  database.users.forEach(user => {
    if (user.id === id) {
      found = true;
      return res.json(user);
    }
  });
  res.status(400).json('User not found');
});

// Increase entries.
app.put('/image', (req, res) => {
  const {id} = req.body;
  let found = false;
  database.users.forEach(user => {
    if (user.id === id) {
      found = true;
      user.entries++;
      return res.json(user.entries);
    }
  });
  return res.status(400).json('User not found');
});

// Start server
app.listen(3000);
