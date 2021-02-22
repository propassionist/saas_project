var express = require('express');
var router = express.Router();

/* GET home page. */
// 근무자관리
router.get('/', function(req, res, next) {

  var db = req.con;
  var data = "";
  var bussCd = req.session.busscd;

  const sql = "SELECT @ROWNUM := @ROWNUM + 1 AS ROWNUM, A.*, B.*, C.* \n" +
              "  FROM HWHNR.SAS_WORKER A\n" +
              "     , HWHNR.SAS_BUSS B\n" +
              "     , HWHNR.SAS_SITE C\n" +
              "     , (SELECT @ROWNUM := 0 ) TMP\n"+
              " WHERE A.BUSSCD = B.BUSSCD \n" +
              "   AND A.BUSSCD = C.BUSSCD \n" +
              "   AND A.BUSSCD = ? \n" +
              "   AND A.SITECD = C.SITECD \n" +
              " ORDER BY A.BUSSCD, A.SITECD, A.WORKERCD";
  console.log(sql);
  db.query(sql, [bussCd]
      , function(error, results, fields) {
          if (error) {
              console.log(error);
              throw error;
          }

          data = results;
          console.log(data);
          res.render('worker', {data: data});
      });
});
module.exports = router;
