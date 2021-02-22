var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

  var db = req.con;
  var data = new Object();
  var bussCd = req.session.busscd;

  const sql = "SELECT * \n" +
              "  FROM HWHNR.SAS_BUSS";

  db.query(sql
      , function(error, results, fields) {
          if (error) {
              console.log(error);
              throw error;
          }

          data = results;
          data.BUSSCD = req.session.busscd;
          console.log(data);
          res.render('siteForm', {data: data});
      });
});

router.post('/', function(req, res, next) {
  let param = JSON.parse(JSON.stringify(req.body));
  var db = req.con;
  var bussCd = req.session.busscd;
  
  var data = "";

  const sql = "INSERT INTO HWHNR.SAS_SITE (SITECD, BUSSCD, SITENM, SITENO, SITEADDR, REMARK) \n" +
              "VALUES (?, ?, ?, ?, ?, ?)";

  db.query(sql, [param.siteCd, bussCd, param.siteNm, param.siteNo, param.siteAddr, param.remark]
      , function(error, results, fields) {
          if (error) {
              console.log(error);
              throw error;
          }

          data = results;
          // console.log(data);
          res.redirect('/site');
      });
});

module.exports = router;
