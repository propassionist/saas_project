var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/:imgName', function(req, res, next) {
  res.send('<img src="/images/corpCert/' + req.params.imgName + '"/>');
});

module.exports = router;
