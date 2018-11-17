const express = require('express');

const router = express.Router();

// middleware that is specific to this router
router.use((req, res, next) => {
  req.time = Date.now();
  next();
});
// define the home page route
router.get('/', (req, res) => {
  res.send(`Birds home page ${req.time}`);
});
// define the about route
router.get('/about', (req, res) => {
  res.json({ name: 'blue' });
});

module.exports = router;
