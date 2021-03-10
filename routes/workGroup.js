var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

  var db = req.con;
  var data = "";
  var bussCd = req.session.busscd;

  const sql = "SELECT A.*, B.* \n" +
              "  FROM HWHNR.SAS_WORK_TYPE A\n" +
              "     , HWHNR.SAS_SITE B\n"+
              " WHERE A.BUSSCD = ? \n" +
              "   AND A.BUSSCD = B.BUSSCD \n" +
              "   AND A.SITECD = B.SITECD \n" +
              " ORDER BY A.BUSSCD, A.SITECD";
  console.log(sql);
  db.query(sql, [bussCd]
      , function(error, results, fields) {
          if (error) {
              console.log(error);
              throw error;
          }

          data = results;
          console.log(data);
          res.render('workGroup', {data: data});
      });
});
module.exports = router;
