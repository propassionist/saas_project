var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

  var db = req.con;
  var data = "";
  var bussCd = req.session.busscd;

  const sql1 = "SELECT * \n" +
               "  FROM HWHNR.SAS_BUSS A \n" +
               " WHERE A.BUSSCD = ?;"
  const sql2 = "SELECT * \n" +
               "  FROM HWHNR.SAS_SITE A\n" +
               " WHERE A.BUSSCD = ?;";
  
  db.query(sql1 + sql2, [bussCd, bussCd]
      , function(error, results, fields) {
          if (error) {
              console.log(error);
              throw error;
          }
          console.log(sql1);
          console.log(sql2);

          data = results;
          bussList = data[0];
          siteList = data[1];
          res.render('workerForm', {bussList: bussList, siteList: siteList});
      });
});

router.post('/', function(req, res, next) {
  let param = JSON.parse(JSON.stringify(req.body));

  var db = req.con;
  var data = "";
  var bussCd = req.session.busscd;

  const sql = "INSERT INTO HWHNR.SAS_WORKER (BUSSCD, SITECD, WORKERCD, NAME, WORKTYP, TELNO, EMAIL, ADDR, BIRTHDAY, STARTYMD) \n" +
              "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  
  db.query(sql, [bussCd, param.siteCd, param.workerCd, param.name, param.workTyp, param.telNo, param.email, param.addr, param.birthDay.replace(/-/gi, ""), param.startYmd.replace(/-/gi, "")]
      , function(error, results, fields) {
          if (error) {
              console.log(error);
              throw error;
          }

          data = results;
          res.redirect('/worker');
      });
});
module.exports = router;
