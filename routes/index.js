var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  const io = req.io;
  try {
    res.render('index', { title: 'Express' });
  } catch (error) {
    console.error(error);
    res.render('index', { title: 'Express' });
  }
});

module.exports = router;
