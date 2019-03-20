const express = require('express');
const server = express();

server.use(express.json());

const users = require('./routes/users');
const posts = require('./routes/posts');

server.use('/api/users', users);
server.use('/api/posts', posts);

server.get('/api', (req, res) => {
  res.status(200).json({ message: 'API Up & Running!' });
});

module.exports = server;
