const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

router.post('/start', (req, res) => {
  const collaborationId = uuidv4();
  res.send({ collaborationId });
});

module.exports = router;