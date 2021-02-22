var express = require('express');
var router = express.Router();

/* GET home page. */
// 사업장관리
router.get('/', function(req, res, next) {

  var db = req.con;
  var data = "";
  var bussCd = req.session.busscd;

  const sql = "SELECT * \n" +
              "  FROM HWHNR.SAS_SITE A    \n" +
              "     , HWHNR.SAS_BUSS B    \n" +
              " WHERE A.BUSSCD = B.BUSSCD \n" +
              "   AND A.BUSSCD = ? \n" +
              " ORDER BY A.BUSSCD, A.SITECD";

  db.query(sql, [bussCd]
      , function(error, results, fields) {
          if (error) {
              console.log(error);
              throw error;
          }

          data = results;
          console.log(data);
          res.render('site', {data: data});
      });
});


module.exports = router;
