var express = require('express');
var router = express.Router();

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('buss');
// });


// 1. 회사관리
router.get('/', function(req, res, next) {

  var db = req.con;
  var data = "";
  
  db.query("SELECT * \n" +
           "FROM HWHNR.SAS_BUSS"
																																	 
      , function(error, results, fields) {
          if (error) {
              console.log(error);
              throw error;
          }
          data = results;
          // console.log(data);
          res.render('buss', {data: data});
      });
});

  
			  
  
router.get('/bussForm', function(req, res, next) {
  let param = JSON.parse(JSON.stringify(req.body));

  var db = req.con;
  var data = "";
  console.log(param);
    res.render('bussForm', {data: data});
});

router.post('/bussForm', function(req, res, next) {
  let param = JSON.parse(JSON.stringify(req.body));

  var db = req.con;
  var data = "";
  console.log(param);
  const sql = "INSERT INTO HWHNR.SAS_BUSS (BUSSCD, BUSSNM, BUSSNO, ADDR, CHIEF, PUBLYMD, REMARK, CREBY, CREDTE, UPDBY, UPDDTE) \n" +
              "VALUES (?, ?, ?, ?, ?, ?, ?, 'ADMIN_INSERT', SYSDATE(), 'ADMIN_INSERT', SYSDATE() )";
  db.query(sql, [param.bussCd, param.bussNm, param.bussNo, param.addr, param.chief, param.publymd.replace(/-/gi, ""), param.remark]
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

router.get('/bussForm/:bussCd', function(req, res, next) {
  let param = JSON.parse(JSON.stringify(req.body));

  var db = req.con;
  var data = "";
  console.log(req.params.bussCd);
  const sql = "SELECT * \n" +
                "FROM HWHNR.SAS_BUSS \n" +
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

													   
router.post('/bussForm/:bussCd', function(req, res, next) {
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

  db.query(sql, [param.bussNm, param.bussNo, param.addr, param.chief, param.publymd, param.remark, req.params.bussCd]
							   
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
