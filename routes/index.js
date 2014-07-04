var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/about', function(req, res) {
  res.render('index', { title: 'hi from zvi bock' });
});

module.exports = router;
