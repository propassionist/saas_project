var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

  var form = "";

  if(req.query.rptCd == 'A'){
    form = require("./req_report.json");
  }else if(req.query.rptCd == 'B'){
    form = require("./clean_report.json");
  }

  res.render('reportForm', {data: form});

});

module.exports = router;
