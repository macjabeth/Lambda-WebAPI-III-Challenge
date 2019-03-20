const router = require('express').Router();
const postDB = require('../../data/helpers/postDb');
const userDB = require('../../data/helpers/userDb');

// C - POST
router.post('/', async (req, res) => {
  let { body: post } = req;

  if (!post.text) {
    return res.status(400).json({
      error: 'Please provide text for the post.'
    });
  }

  try {
    const user = await userDB.getById(id);
    Boolean(user)
      ? res.status(201).json(await postDB.insert(post))
      : res.status(404).json({ message: 'The user with the specified ID does not exist.' });
  } catch (error) {
    res.status(500).json({
      error: `There was an error while saving the post to the database; ${error}`
    });
  }
});

// R - GET
router.get('/', async (req, res) => {
  try {
    const posts = await postDB.get();
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({
      error: `The posts information could not be retrieved; ${error}`
    });
  }
});

router.get('/:id', async (req, res) => {
  const { params: { id } } = req;
  try {
    const post = await postDB.getById(id);
    Boolean(post)
      ? res.status(200).json(post)
      : res.status(404).json({ message: 'The post with the specified ID does not exist.' });
  } catch (error) {
    res.status(500).json({
      message: `The post information could not be retrieved; ${error}`
    });
  }
});

// U - PUT
router.put('/:id', async (req, res) => {
  const {
    body: post,
    params: { id }
  } = req;

  if (!post.text) {
    return res.status(400).json({
      error: 'Please provide text for the post.'
    });
  }

  try {
    const user = await userDB.getById(id);
    Boolean(user)
      ? user.id === id
        ? Boolean(await postDB.update(id, post))
          ? res.status(200).json(await postDB.getById(id))
          : res.status(404).json({ message: 'The post with the specified ID does not exist.' })
        : res.status(401).json({ message: 'You are not authorised to edit this post.' })
      : res.status(404).json({ message: 'The user with the specified ID does not exist.' });
  } catch (error) {
    res.status(500).json({
      error: `The post information could not be modified; ${error}`
    });
  }
});

// D - DELETE
router.delete('/:id', async (req, res) => {
  const { params: { id } } = req;

  try {
    const count = await postDB.remove(id);
    Boolean(count)
      ? res.status(200).json({ message: 'The post has been deleted.' })
      : res.status(404).json({ message: 'The post with the specified ID does not exist.' });
  } catch (error) {
    res.status(500).json({
      error: `The post could not be removed; ${error}`
    });
  }
});

module.exports = router;
