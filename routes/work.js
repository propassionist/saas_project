var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {

  var db = req.con;
  var data = new Object();
  var bussCd = req.session.bussCd;

  bussCd = "B000000001";

  var query = db.query("SELECT A.BUSSCD, B.BUSSNM, A.SITECD, C.SITENM, A.WORKCD, A.WORKDTE, A.WORKNM, A.WORKERCD, F.NAME WORKERNM \n" +
    ", A.MNGPOINTCD, E.MNGPOINTNM, A.REMARK, A.RPTCD, D.RPTNM, A.STATUS \n" +
    "FROM SAS_WORK A \n" +
    "LEFT OUTER JOIN SAS_BUSS B ON A.BUSSCD = B.BUSSCD \n" +
    "LEFT OUTER JOIN SAS_SITE C ON A.BUSSCD = C.BUSSCD AND A.SITECD = C.SITECD \n" +
    "LEFT OUTER JOIN SAS_REPORT_MST D ON A.BUSSCD = D.BUSSCD AND A.RPTCD = D.RPTCD \n" +
    "LEFT OUTER JOIN SAS_MNG_POINT E ON A.BUSSCD = E.BUSSCD AND A.MNGPOINTCD = E.MNGPOINTCD \n" +
    "LEFT OUTER JOIN SAS_WORKER F ON A.BUSSCD = F.BUSSCD AND A.SITECD = F.SITECD AND A.WORKERCD = F.WORKERCD \n" +
    "WHERE A.BUSSCD = ?"
    // , [req.session.busscd, req.body.rptCd], function (error, results, fields) {
    , [bussCd], function (error, results, fields) {
      if (error) {
        console.log(error);
        throw error;
      }

      console.log(query.sql);

      data = results;
      data.BUSSCD = bussCd;

      res.render('work', { data: results });
    });

});

router.get('/form', function (req, res, next) {

  var db = req.con;

  var data = new Object();
  var site = "";
  var mngPoint = "";
  var rpt = "";

  var bussCd = req.session.bussCd;
  bussCd = "B000000001";
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

      query = db.query("SELECT MNGPOINTCD, MNGPOINTNM \n" +
        "FROM SAS_MNG_POINT A \n" +
        "WHERE A.BUSSCD = ?"
        // , [req.session.busscd, req.body.rptCd], function (error, results, fields) {
        , [bussCd], function (error, results, fields) {
          if (error) {
            console.log(error);
            throw error;
          }

          console.log(query.sql);

          mngPoint = results;

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

              res.render('workForm', { data, site: site, mngPoint: mngPoint, rpt: rpt });
            });
        });


    });

  // res.render('mngPointForm');
  // res.render('mngPointForm');
});

router.post('/form', function (req, res, next) {

  var db = req.con;

  var data = "";
  var site = "";
  var mngPoint = "";
  var rpt = "";

  var rowIdx = req.body.rowIdx;
  var bussCd = req.body.bussCd[rowIdx];
  // var bussCd = req.body.bussCd;
  var siteCd = req.body.siteCd[rowIdx];
  var workCd = req.body.workCd[rowIdx];
  if (typeof req.body.bussCd == "string") {
    bussCd = req.body.bussCd;
    siteCd = req.body.siteCd;
    workCd = req.body.workCd;
  }

  var query = db.query("SELECT A.BUSSCD, B.BUSSNM, A.SITECD, C.SITENM, A.WORKCD, A.WORKNM, A.WORKERCD, F.NAME WORKERNM, A.MNGPOINTCD, E.MNGPOINTNM, A.REMARK, A.RPTCD, D.RPTNM \n" +
    "FROM SAS_WORK A \n" +
    "LEFT OUTER JOIN SAS_BUSS B ON A.BUSSCD = B.BUSSCD \n" +
    "LEFT OUTER JOIN SAS_SITE C ON A.BUSSCD = C.BUSSCD AND A.SITECD = C.SITECD \n" +
    "LEFT OUTER JOIN SAS_REPORT_MST D ON A.BUSSCD = D.BUSSCD AND A.RPTCD = D.RPTCD \n" +
    "LEFT OUTER JOIN SAS_MNG_POINT E ON A.BUSSCD = E.BUSSCD AND A.MNGPOINTCD = E.MNGPOINTCD \n" +
    "LEFT OUTER JOIN SAS_WORKER F ON A.BUSSCD = F.BUSSCD AND A.SITECD = F.SITECD AND A.WORKERCD = F.WORKERCD \n" +
    "WHERE A.BUSSCD = ? AND A.SITECD = ? AND A.WORKCD = ?"
    // , [req.session.busscd, req.body.rptCd], function (error, results, fields) {
    , [bussCd, siteCd, workCd], function (error, results, fields) {
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

          query = db.query("SELECT MNGPOINTCD, MNGPOINTNM \n" +
            "FROM SAS_MNG_POINT A \n" +
            "WHERE A.BUSSCD = ?"
            // , [req.session.busscd, req.body.rptCd], function (error, results, fields) {
            , [bussCd], function (error, results, fields) {
              if (error) {
                console.log(error);
                throw error;
              }

              console.log(query.sql);

              mngPoint = results;

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

                  res.render('workForm', { data: data, site: site, mngPoint: mngPoint, rpt: rpt });
                });
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
  var workCd = req.body.workCd;
  var workNm = req.body.title;
  var mngPointCd = req.body.mngPointCd;
  var remark = req.body.remark;
  var rptCd = req.body.rptCd;

  //RPTCD 추출
  var query = db.query("SELECT GET_WORKCD() WORKCD FROM DUAL"
    , function (error, results, fields) {
      if (error) {
        console.log(error);
        throw error;
      }

      //RPTCD세팅
      console.log(query.sql);

      if (workCd == undefined || workCd == '')
        workCd = results[0].WORKCD;

      post = {
        BUSSCD: bussCd,
        SITECD: siteCd,
        WORKCD: workCd,
        WORKNM: workNm,
        REMARK: remark,
        MNGPOINTCD: mngPointCd,
        RPTCD: rptCd
      };

      //RPT입력
      query = db.query("INSERT INTO SAS_WORK SET ? ON DUPLICATE KEY UPDATE SITECD = '" + siteCd + "', WORKNM = '" + workNm + "', REMARK = '" + remark + "', " +
        "MNGPOINTCD = '" + mngPointCd + "', RPTCD = '" + rptCd + "'", post
        , function (error, results, fields) {
          if (error) {
            console.log(error);
            throw error;
          }

          console.log(query.sql);
          console.log('inserted ' + results.affectedRows + ' rows');

          res.redirect("/work");
        });
    });

});

module.exports = router;
