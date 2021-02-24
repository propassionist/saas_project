var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  let param = JSON.parse(JSON.stringify(req.body));

  var db = req.con;
  var data = "";
  console.log(param);
    res.render('bussForm', {data: data});
});

router.post('/', function(req, res, next) {
  let param = JSON.parse(JSON.stringify(req.body));

  var db = req.con;
  var data = "";
  console.log(param);
  const sql = "INSERT INTO HWHNR.SAS_BUSS (BUSSCD, BUSSNM, BUSSNO, ADDR, CHIEF, PUBLYMD, REMARK, CREBY, CREDTE, UPDBY, UPDDTE) \n" +
              "VALUES ((SELECT CONCAT('B', LPAD(COALESCE(MAX(SUBSTR(BUSSCD, 2)), 0) + 1, 9, '0')) FROM HWHNR.SAS_BUSS BUSSCD) , ?, ?, ?, ?, ?, ?, 'ADMIN_INSERT', SYSDATE(), 'ADMIN_INSERT', SYSDATE() )";
  db.query(sql, [param.bussNm, param.bussNo, param.addr, param.chief, param.publymd.replace(/-/gi, ""), param.remark]
      , function(error, results, fields) {
          if (error) {
              console.log(error);
              throw error;
          }

          data = results;
          // console.log(data);
          res.redirect('/buss');
      });
});

router.get('/:bussCd', function(req, res, next) {
  let param = JSON.parse(JSON.stringify(req.body));

  var db = req.con;
  var data = "";
  console.log(req.params.bussCd);
  const sql = "SELECT DATE_FORMAT(A.PUBLYMD, '%Y-%m-%d') AS PUBLYMD, BUSSCD, BUSSNM, BUSSNO, ADDR, CHIEF, REMARK, DOMAIN, IMG, CIIMG, ATRB1, CREBY, CREDTE, UPDBY, UPDDTE \n" +
                "FROM HWHNR.SAS_BUSS A \n" +
                "WHERE BUSSCD = ?";

  db.query(sql, [req.params.bussCd]
							   
      , function(error, results, fields) {
          if (error) {
              console.log(error);
              throw error;
          }

          data = results;
          console.log(data);
          res.render('bussForm', {data: data});
          //res.redirect('/bussForm');
      });
});

													   
router.post('/:bussCd', function(req, res, next) {
  let param = JSON.parse(JSON.stringify(req.body));

  var db = req.con;
  var data = "";
  console.log(req.params);
  console.log(param);
  const sql = "UPDATE HWHNR.SAS_BUSS\n" +
                " SET BUSSNM  = ?\n" +
                "   , BUSSNO  = ?\n" +
                "   , ADDR    = ?\n" +
                "   , CHIEF   = ?\n" +
                "   , PUBLYMD = ?\n" +
                "   , REMARK  = ?\n" +
                "WHERE BUSSCD = ?";

  db.query(sql, [param.bussNm, param.bussNo, param.addr, param.chief, param.publymd.replace(/-/gi, ""), param.remark, req.params.bussCd]
							   
      , function(error, results, fields) {
          if (error) {
              console.log(error);
              throw error;
          }

          data = results;
          console.log(data);
          // res.render('bussForm', {data: data});
          //res.redirect('/bussForm');
          res.redirect('/buss');
      });
});
module.exports = router;
