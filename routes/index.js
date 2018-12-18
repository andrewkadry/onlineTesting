var express = require('express');
var router = express.Router();

/* GET registration page. */
router.get('/', function(req, res, next) {
  var sql = "SELECT * FROM `position`";
  db.query(sql, function (err, result) {
    if (err)
      return res.status(500).send(err);
    res.render('index', { title: 'Registration', positions: result });
  });
});

/* GET candidate login page. */
router.get('/login', function(req, res, next) {
    res.render('candidateLogin', { title: 'Login' });
});

/* GET candidate profile page. */
router.get('/profile', function(req, res, next) {
  res.render('candidateProfile', { title: 'Profile' });
});

module.exports = router;
