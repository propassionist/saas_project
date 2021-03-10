var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

  var db = req.con;
  var data = "";
  var bussCd = req.session.busscd;
  console.log(bussCd);


  const sql = "SELECT * \n" +
               "  FROM HWHNR.SAS_SITE A \n" +
               " WHERE A.BUSSCD = ?;"
  
  db.query(sql, [bussCd]
      , function(error, results, fields) {
          if (error) {
              console.log(error);
              throw error;
          }
          console.log(sql);

          data = results;
          siteList = data;
          res.render('workGroupForm', {siteList: siteList});
      });
});

router.post('/', function(req, res, next) {
  let param = JSON.parse(JSON.stringify(req.body));

  var db = req.con;
  var data = "";
  var bussCd = req.session.busscd;

  const sql = "INSERT INTO HWHNR.SAS_WORK_TYPE (BUSSCD, SITECD, WORKTYPCD, WORKTYPNM, TIMEFROM, TIMETO, CREBY, CREDTE, UPDBY, UPDDTE) \n" +
              "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  
  db.query(sql, [bussCd, param.siteCd, param.workTypCd, param.workTypNm, param.workTyp, param.telNo, param.email, param.addr, param.birthDay.replace(/-/gi, ""), param.startYmd.replace(/-/gi, "")]
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
