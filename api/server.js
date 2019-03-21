const express = require('express');
const cors = require('cors');
const server = express();

server.use(express.json());
server.use(cors());

const users = require('./routes/users');
const posts = require('./routes/posts');

server.use('/api/users', users);
server.use('/api/posts', posts);

server.get('/api', (req, res) => {
  res.status(200).json({ message: 'API Up & Running!' });
});

module.exports = server;
