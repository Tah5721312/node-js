const express = require('express');
const router = express.Router();

console.log("✅ test router loaded");

router.get('/', (req, res) => {
  console.log("✅ /api/test hit");
  res.send("test router working");
});

module.exports = router;
