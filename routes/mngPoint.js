var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {

  var db = req.con;
  var bussCd = req.session.busscd;
  // bussCd = "B000000001";

  var query = db.query("SELECT A.BUSSCD, B.BUSSNM, A.SITECD, C.SITENM, A.MNGPOINTCD, A.MNGPOINTNM, A.REMARK, A.RPTCD, D.RPTNM \n" +
    "FROM SAS_MNG_POINT A \n" +
    "LEFT OUTER JOIN SAS_BUSS B ON A.BUSSCD = B.BUSSCD \n" +
    "LEFT OUTER JOIN SAS_SITE C ON A.BUSSCD = C.BUSSCD AND A.SITECD = C.SITECD \n" +
    "LEFT OUTER JOIN SAS_REPORT_MST D ON A.BUSSCD = D.BUSSCD AND A.RPTCD = D.RPTCD \n" +
    "WHERE A.BUSSCD = ?"
    // , [req.session.busscd, req.body.rptCd], function (error, results, fields) {
    , [bussCd], function (error, results, fields) {
      if (error) {
        console.log(error);
        throw error;
      }

      console.log(query.sql);

      res.render('mngPoint', { data: results });
    });

});

router.get('/form', function (req, res, next) {

  var db = req.con;

  var data = new Object();
  var site = "";
  var rpt = "";

  var bussCd = req.session.busscd;
  // bussCd = "B000000001";
  data.BUSSCD = bussCd;

  var query = db.query("SELECT SITECD, SITENM \n" +
    "FROM SAS_SITE A \n" +
    "WHERE A.BUSSCD = ?"
    // , [req.session.busscd, req.body.rptCd], function (error, results, fields) {
    , [bussCd], function (error, results, fields) {
      if (error) {
        console.log(error);
        throw error;
      }

      console.log(query.sql);

      site = results;

      query = db.query("SELECT RPTCD, RPTNM \n" +
        "FROM SAS_REPORT_MST A \n" +
        "WHERE A.BUSSCD = ?"
        // , [req.session.busscd, req.body.rptCd], function (error, results, fields) {
        , [bussCd], function (error, results, fields) {
          if (error) {
            console.log(error);
            throw error;
          }

          console.log(query.sql);

          rpt = results;

          res.render('mngPointForm', { data, site: site, rpt: rpt });
        });
    });

  // res.render('mngPointForm');
  // res.render('mngPointForm');
});

router.post('/form', function (req, res, next) {

  var db = req.con;

  var data = "";
  var site = "";
  var rpt = "";

  var rowIdx = req.body.rowIdx;
  var bussCd = req.body.bussCd[rowIdx];
  var siteCd = req.body.siteCd[rowIdx];
  var mngPointCd = req.body.mngPointCd[rowIdx];
  if(typeof req.body.bussCd == "string"){
    bussCd = req.body.bussCd;
    siteCd = req.body.siteCd;
    mngPointCd = req.body.mngPointCd;
  }

  var query = db.query("SELECT A.BUSSCD, B.BUSSNM, A.SITECD, C.SITENM, A.MNGPOINTCD, A.MNGPOINTNM, A.REMARK, A.RPTCD, D.RPTNM \n" +
    "FROM SAS_MNG_POINT A \n" +
    "LEFT OUTER JOIN SAS_BUSS B ON A.BUSSCD = B.BUSSCD \n" +
    "LEFT OUTER JOIN SAS_SITE C ON A.BUSSCD = C.BUSSCD AND A.SITECD = C.SITECD \n" +
    "LEFT OUTER JOIN SAS_REPORT_MST D ON A.BUSSCD = D.BUSSCD AND A.RPTCD = D.RPTCD \n" +
    "WHERE A.BUSSCD = ? AND A.SITECD = ? AND A.MNGPOINTCD = ?"
    // , [req.session.busscd, req.body.rptCd], function (error, results, fields) {
    , [bussCd, siteCd, mngPointCd], function (error, results, fields) {
      if (error) {
        console.log(error);
        throw error;
      }

      console.log(query.sql);

      data = results[0];

      query = db.query("SELECT SITECD, SITENM \n" +
        "FROM SAS_SITE A \n" +
        "WHERE A.BUSSCD = ?"
        // , [req.session.busscd, req.body.rptCd], function (error, results, fields) {
        , [bussCd], function (error, results, fields) {
          if (error) {
            console.log(error);
            throw error;
          }

          console.log(query.sql);

          site = results;

          query = db.query("SELECT RPTCD, RPTNM \n" +
            "FROM SAS_REPORT_MST A \n" +
            "WHERE A.BUSSCD = ?"
            // , [req.session.busscd, req.body.rptCd], function (error, results, fields) {
            , [bussCd], function (error, results, fields) {
              if (error) {
                console.log(error);
                throw error;
              }

              console.log(query.sql);

              rpt = results;

              res.render('mngPointForm', { data: data, site: site, rpt: rpt });
            });
        });
    });

});

router.post('/save', function (req, res, next) {

  var db = req.con;

  var data = "";
  var site = "";
  var rpt = "";

  var bussCd = req.body.bussCd;
  var siteCd = req.body.site;
  var mngPointCd = req.body.mngPointCd;
  var mngPointNm = req.body.mngPointNm;
  var remark = req.body.remark;
  var rptCd = req.body.rptCd;

  //RPTCD 추출
  var query = db.query("SELECT GET_MNGPOINTCD() MNGPOINTCD FROM DUAL"
    , function (error, results, fields) {
      if (error) {
        console.log(error);
        throw error;
      }

      //RPTCD세팅
      console.log(query.sql);

      if (mngPointCd == undefined || mngPointCd == '')
        mngPointCd = results[0].MNGPOINTCD;

      post = {
        BUSSCD: bussCd,
        SITECD: siteCd,
        MNGPOINTCD: mngPointCd,
        MNGPOINTNM: mngPointNm,
        REMARK: remark,
        RPTCD: rptCd
      };

      //RPT입력
      query = db.query("INSERT INTO SAS_MNG_POINT SET ? ON DUPLICATE KEY UPDATE SITECD = '" + siteCd + "', MNGPOINTNM = '" + mngPointNm + "', REMARK = '" + remark + "', RPTCD = '" + rptCd + "'", post
        , function (error, results, fields) {
          if (error) {
            console.log(error);
            throw error;
          }

          console.log(query.sql);
          console.log('inserted ' + results.affectedRows + ' rows');

          res.redirect("/mngPoint");
        });
    });

});

module.exports = router;
