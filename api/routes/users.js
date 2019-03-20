const router = require('express').Router();
const userDB = require('../../data/helpers/userDb');

// Middleware
function checkNameCasing(req, res, next) {
  req.body.name = req.body.name.toUpperCase();
  next();
}

// C - POST
router.post('/', checkNameCasing, async (req, res) => {
  let { body: user } = req;

  if (!user.name) {
    return res.status(400).json({
      error: 'Please provide a name for the user.'
    });
  }

  try {
    user = await userDB.insert(user);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({
      error: `There was an error while saving the user to the database; ${error}`
    });
  }
});

// R - GET
router.get('/', async (req, res) => {
  try {
    const users = await userDB.get();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      error: `The users information could not be retrieved; ${error}`
    });
  }
});

router.get('/:id', async (req, res) => {
  const { params: { id } } = req;
  try {
    const user = await userDB.getById(id);
    Boolean(user)
      ? res.status(200).json(user)
      : res.status(404).json({ message: 'The user with the specified ID does not exist.' });
  } catch (error) {
    res.status(500).json({
      message: `The user information could not be retrieved; ${error}`
    });
  }
});

// U - PUT
router.put('/:id', checkNameCasing, async (req, res) => {
  const {
    body: user,
    params: { id }
  } = req;

  if (!user.name) {
    return res.status(400).json({
      error: 'Please provide a name for the user.'
    });
  }

  try {
    const count = await userDB.update(id, user);
    Boolean(count)
      ? res.status(200).json(await userDB.getById(id))
      : res.status(404).json({ message: 'The user with the specified ID does not exist.' });
  } catch (error) {
    res.status(500).json({
      error: `The user information could not be modified; ${error}`
    });
  }
});

// D - DELETE
router.delete('/:id', async (req, res) => {
  const { params: { id } } = req;

  try {
    const count = await userDB.remove(id);
    Boolean(count)
      ? res.status(200).json({ message: 'The user has been deleted.', id })
      : res.status(404).json({ message: 'The user with the specified ID does not exist.' });
  } catch (error) {
    res.status(500).json({
      error: `The user could not be removed; ${error}`
    });
  }
});

module.exports = router;
