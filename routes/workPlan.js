var express = require('express');
var router = express.Router();

var mysql = require('mysql');
var async = require('async');

/* GET home page. */
router.get('/', function (req, res, next) {

  var db = req.con;
  const bussCd = req.session.busscd;
  const siteCd = req.query.site;
  const usrId = req.session.usrId;
  // workerCd = '201700117';

  var site = new Object();
  var data = new Object();
  var data2 = new Object();
  var data3 = new Object();
  // bussCd = 'B000000001';
  // siteCd = '0100';

  const sql1 = "SELECT * FROM SAS_SITE A INNER JOIN SAS_WORKER B ON A.BUSSCD = B.BUSSCD AND A.SITECD = B.SITECD WHERE A.BUSSCD = ? AND B.USRID = ?;";
  const sql2 = "SELECT * FROM SAS_WORKER WHERE BUSSCD = ? AND SITECD = ? AND USRID = ?;";
  
  var query = db.query(sql1 + sql2
    // , [req.session.busscd], function (error, results, fields) {
    , [bussCd, usrId, bussCd, siteCd, usrId], function (error, results, fields) {
      if (error) {
        console.log(error);
        throw error;
      }

      console.log(query.sql);
      console.log(results);

      site = results[0];
      var workerCd = ""
      if(results[1].length > 0)
        workerCd = results[1][0].WORKERCD;

      // query = db.query("SELECT A.BUSSCD, A.SITECD, A.WORKYMD \n" +
      //                 ", A.WORKERCD, C.NAME, A.WORKTYP, D.WORKTYPNM \n" +
      //                 ", A.RELATEDTO, A.SWITCHEDWITH, A.STATUS, A.APPRSTATUS \n" +
      //                 ", A.CREBY, A.CREDTE, A.UPDBY, A.UPDDTE \n" +
      //                  "FROM SAS_SCHEDULE A \n" +
      //                  "INNER JOIN (SELECT MAX(CREDTE) MAXCREDTE, BUSSCD, SITECD, WORKYMD, WORKERCD  \n" +
      //                  "            FROM SAS_SCHEDULE \n" +
      //                  "            WHERE STATUS <> 'D' OR (STATUS = 'D' AND RELATEDTO = '') \n" +
      //                  "            GROUP BY BUSSCD, SITECD, WORKYMD, WORKERCD \n" +
      //                  "          ) B ON A.BUSSCD = B.BUSSCD AND A.SITECD = B.SITECD AND A.WORKYMD = B.WORKYMD AND A.WORKERCD = B.WORKERCD AND A.CREDTE = B.MAXCREDTE \n" +
      //                  "LEFT OUTER JOIN SAS_WORKER C ON A.BUSSCD = C.BUSSCD AND A.SITECD = C.SITECD AND A.WORKERCD = C.WORKERCD  \n" +
      //                  "LEFT OUTER JOIN SAS_WORK_TYPE D ON A.BUSSCD = D.BUSSCD AND A.SITECD = D.SITECD AND A.WORKTYP = D.WORKTYPCD  \n" +
      //                  "WHERE A.BUSSCD = ? AND A.SITECD = ? AND (STATUS <> 'D' OR (STATUS = 'D' AND APPRSTATUS <> '05')) "
        query = db.query("SELECT \n" +
                      " * \n" +
                      // " BUSSCD,SITECD, \n" +
                      // " WORKYMD,WORKTYP,R \n" +
                      // " ELATEDTO,SWITCHEDWITH,STATUS,APPRSTATUS,CREBY,CREDTE,UPDBY,UPDDTE \n" +
                      " FROM ( \n" +
                      //  ", A.WORKYMD, A.WORKERCD, C.NAME, A.WORKTYP, D.WORKTYPNM \n" +
                      //  ", B1.WORKYMD, B1.WORKERCD, C1.NAME, B1.WORKTYP, D1.WORKTYPNM \n" +
                      //  ", CASE WHEN B1.APPRSTATUS = '05' THEN B1.WORKYMD ELSE A.WORKYMD END WORKYMD \n" +
                      //  ", CASE WHEN B1.APPRSTATUS = '05' THEN B1.WORKERCD ELSE A.WORKERCD END WORKERCD \n" +
                      //  ", CASE WHEN B1.APPRSTATUS = '05' THEN C1.NAME ELSE C.NAME END NAME \n" +
                      //  ", CASE WHEN B1.APPRSTATUS = '05' THEN B1.WORKTYP ELSE A.WORKTYP END WORKTYP \n" +
                      //  ", CASE WHEN B1.APPRSTATUS = '05' THEN D1.WORKTYPNM ELSE D.WORKTYPNM END WORKTYPNM \n" +
                      //  ", CASE WHEN B1.APPRSTATUS = '05' THEN B1.STATUS ELSE A.STATUS END STATUS \n" +
                      //  ", CASE WHEN B1.APPRSTATUS = '05' THEN B1.APPRSTATUS ELSE A.APPRSTATUS END APPRSTATUS \n" +
                      //  ", A.WORKYMD \n" +
                      //  ", A.WORKERCD \n" +
                      //  ", C.NAME \n" +
                      //  ", A.WORKTYP \n" +
                      //  ", D.WORKTYPNM \n" +
                      //  ", CASE WHEN B1.APPRSTATUS = '04' AND A.WORKTYP = B1.WORKTYP AND (B1.STATUS = 'DF') THEN B1.STATUS ELSE A.STATUS END STATUS \n" +
                      //  ", CASE WHEN B1.APPRSTATUS = '04' AND A.WORKTYP = B1.WORKTYP AND (B1.STATUS = 'DF') THEN B1.APPRSTATUS ELSE A.APPRSTATUS END APPRSTATUS \n" +
                      " SELECT A.BUSSCD, A.SITECD \n" +
                      ", CASE WHEN A.APPRSTATUS = '04' THEN B1.WORKYMD ELSE A.WORKYMD END WORKYMD \n" +
                      ", CASE WHEN A.APPRSTATUS = '04' THEN B1.WORKERCD ELSE A.WORKERCD END WORKERCD \n" +
                      ", CASE WHEN A.APPRSTATUS = '04' THEN C1.NAME ELSE C.NAME END NAME \n" +
                      ", CASE WHEN A.APPRSTATUS = '04' THEN B1.WORKTYP ELSE A.WORKTYP END WORKTYP \n" +
                      ", CASE WHEN A.APPRSTATUS = '04' THEN D1.WORKTYPNM ELSE D.WORKTYPNM END WORKTYPNM \n" +
                      ", CASE WHEN A.APPRSTATUS = '04' THEN B1.STATUS ELSE A.STATUS END STATUS \n" +
                      ", CASE WHEN A.APPRSTATUS = '04' THEN B1.RELATEDTO ELSE A.RELATEDTO END RELATEDTO \n" +
                      // ", A.STATUS \n" +
                      // ", A.RELATEDTO \n" +
                      ", CASE WHEN A.APPRSTATUS = '04' THEN B1.SWITCHEDWITH ELSE A.SWITCHEDWITH END SWITCHEDWITH \n" +
                      ", CASE WHEN A.APPRSTATUS = '04' THEN B1.CREBY ELSE A.CREBY END CREBY \n" +
                      ", CASE WHEN A.APPRSTATUS = '04' THEN B1.CREDTE ELSE A.CREDTE END CREDTE \n" +
                      ", CASE WHEN A.APPRSTATUS = '04' THEN B1.UPDBY ELSE A.UPDBY END UPDBY \n" +
                      ", CASE WHEN A.APPRSTATUS = '04' THEN B1.UPDDTE ELSE A.UPDDTE END UPDDTE \n" +
                      ", A.APPRSTATUS \n" +
                      // ", CASE WHEN A.STATUS = 'D' AND A.RELATEDTO <> '' THEN 'Y' ELSE 'N' END AS HIDDENYN \n" +
                      // ", CASE WHEN CONCAT(A.WORKYMD, '|', A.WORKERCD, '|', A.WORKTYP) = A.RELATEDTO THEN 'Y' ELSE 'N' END HIDDENYN \n" +
                      //  ", A.RELATEDTO, A.SWITCHEDWITH \n" +
                      //  ", A.CREBY, A.CREDTE, A.UPDBY, A.UPDDTE \n" +
                       " FROM SAS_SCHEDULE A \n" +
                       " INNER JOIN (SELECT MAX(CASE WHEN APPRSTATUS = '04' THEN '' ELSE CREDTE END) BEFOREREJECTMAXDTE, MAX(CREDTE) MAXDTE, BUSSCD, SITECD, WORKYMD, WORKERCD  \n" +
                       "            FROM SAS_SCHEDULE \n" +
                        // "            WHERE APPRSTATUS <> '04' \n" +
                        "            GROUP BY BUSSCD, SITECD, WORKYMD, WORKERCD \n" +
                        "          ) B ON A.BUSSCD = B.BUSSCD AND A.SITECD = B.SITECD AND A.WORKYMD = B.WORKYMD AND A.WORKERCD = B.WORKERCD AND A.CREDTE = B.MAXDTE \n" +
                        "LEFT OUTER JOIN SAS_SCHEDULE B1 ON B.BUSSCD = B1.BUSSCD AND B.SITECD = B1.SITECD AND B.WORKYMD = B1.WORKYMD AND B.WORKERCD = B1.WORKERCD AND B.BEFOREREJECTMAXDTE = B1.CREDTE AND B1.STATUS <> 'D' \n" +
                        // "LEFT OUTER JOIN (SELECT MAX(CREDTE) MAXCREDTE, BUSSCD, SITECD, WORKYMD, WORKERCD  \n" +
                        // "            FROM SAS_SCHEDULE \n" +
                        // "            WHERE APPRSTATUS = '05' \n" +
                        // "            GROUP BY BUSSCD, SITECD, WORKYMD, WORKERCD \n" +
                        // "          ) B1 ON A.BUSSCD = B1.BUSSCD AND A.SITECD = B1.SITECD AND A.RELATEDTO = CONCAT(B1.WORKYMD, '|', B1.WORKERCD, '|', B1.WORKTYP) AND A.CREDTE = B.MAXCREDTE \n" +
                        // "LEFT OUTER JOIN SAS_SCHEDULE B1 ON A.BUSSCD = B1.BUSSCD AND A.SITECD = B1.SITECD AND CONCAT(A.WORKYMD, '|', A.WORKERCD, '|', A.WORKTYP) = B1.RELATEDTO AND B1.APPRSTATUS IN ('02', '03') AND B1.STATUS <> 'D' \n" +
                        "LEFT OUTER JOIN SAS_WORKER C ON A.BUSSCD = C.BUSSCD AND A.SITECD = C.SITECD AND A.WORKERCD = C.WORKERCD  \n" +
                        "LEFT OUTER JOIN SAS_WORK_TYPE D ON A.BUSSCD = D.BUSSCD AND A.SITECD = D.SITECD AND A.WORKTYP = D.WORKTYPCD  \n" +
                        "LEFT OUTER JOIN SAS_WORKER C1 ON B1.BUSSCD = C1.BUSSCD AND B1.SITECD = C1.SITECD AND B1.WORKERCD = C1.WORKERCD  \n" +
                        "LEFT OUTER JOIN SAS_WORK_TYPE D1 ON B1.BUSSCD = D1.BUSSCD AND B1.SITECD = D1.SITECD AND B1.WORKTYP = D1.WORKTYPCD  \n" +
                        "WHERE A.BUSSCD = ? AND A.SITECD = ? AND (A.STATUS <> 'D' OR (A.STATUS = 'D' AND A.APPRSTATUS <> '05') ) " +
                        ") A \n" +
                        "GROUP BY WORKERCD,BUSSCD,SITECD,WORKYMD,WORKTYP,RELATEDTO,SWITCHEDWITH,STATUS,APPRSTATUS,CREBY,CREDTE,UPDBY,UPDDTE \n"
                        // "WHERE A.BUSSCD = ? AND A.SITECD = ? AND B1.BUSSCD IS NULL "
        // , [req.session.busscd], function (error, results, fields) {
        , [bussCd, siteCd], function (error, results, fields) {
          if (error) {
            console.log(error);
            throw error;
          }

          console.log(query.sql);
          console.log(results);
          console.log(query.sql);

          data = results;

          query = db.query("SELECT * FROM SAS_WORK_TYPE WHERE BUSSCD = ? AND SITECD = ?"
            // , [req.session.busscd], function (error, results, fields) {
            , [bussCd, siteCd], function (error, results, fields) {
              if (error) {
                console.log(error);
                throw error;
              }

              console.log(query.sql);
              console.log(results);

              data2 = results;

              query = db.query("SELECT * FROM SAS_WORKER WHERE BUSSCD = ? AND SITECD = ?"
                // , [req.session.busscd], function (error, results, fields) {
                , [bussCd, siteCd], function (error, results, fields) {
                  if (error) {
                    console.log(error);
                    throw error;
                  }

                  console.log(query.sql);
                  console.log(results);

                  data3 = results;

                  res.render('workPlan', { workerCd: workerCd, siteCd: siteCd, site:site, data: data, data2: data2, data3: data3 });

                });

            });

        });
    });

});

router.post('/save', function (req, res, next) {
  var db = req.con;

  var bussCd = req.session.busscd;
  var siteCd = req.body.site;
  var arr = JSON.parse(req.body.data);
  // bussCd = 'B000000001';

  // for(var i=0; i<arr.length; i++){
  async.eachOfSeries(arr, function (eventObj, key, callback) {

    var event = eventObj.split("|");

    var approvalCheckPost = [ bussCd, siteCd, event[0], event[1] ];
    var post = { BUSSCD: bussCd, SITECD: siteCd, WORKYMD: event[0], WORKERCD: event[1], WORKTYP: event[2], STATUS: event[3], APPRSTATUS: "02", CREBY: req.session.usrId, CREDTE: mysql.raw("NOW()") };

    if(event.length > 4){
      post.RELATEDTO = event.slice(4, 7).join("|");
    }
    if(event.length > 7){
      post.SWITCHEDWITH = event.slice(-3).join("|");
    }

    var query = db.query("SELECT APPRSTATUS \n" +
                         "FROM SAS_SCHEDULE A \n" +
                         "INNER JOIN (SELECT MAX(CREDTE) MAXDTE, BUSSCD, SITECD, WORKYMD, WORKERCD  \n" +
                         "            FROM SAS_SCHEDULE \n" +
                         "            GROUP BY BUSSCD, SITECD, WORKYMD, WORKERCD \n" +
                         "          ) B ON A.BUSSCD = B.BUSSCD AND A.SITECD = B.SITECD AND A.WORKYMD = B.WORKYMD AND A.WORKERCD = B.WORKERCD AND A.CREDTE = B.MAXDTE \n" +
                         "WHERE A.BUSSCD = ? AND A.SITECD = ? AND A.WORKYMD = ? AND A.WORKERCD = ? \n"
      , approvalCheckPost
      , function (error, results, fields) {
        if (error) {
          console.log(error);
          throw error;
        }

        console.log(query.sql);
        console.log(results);

        // if(!results[0] || results[0].APPRSTATUS == "04" || results[0].APPRSTATUS == "05"){ // 반려(04) or 결재완료(05) 상태인 경우만 변경 요청 가능 (결재중 상태 변경 요청 불가)
          query = db.query("INSERT INTO SAS_SCHEDULE SET ? ", post
            , function (error, results, fields) {
              if (error) {
                console.log(error);
                throw error;
              }

              console.log(query.sql);
              console.log('inserted ' + results.affectedRows + ' rows');

              callback();
          });
        // }else{
        //   callback("결재 중인 건이 있어 처리가 중단 됐습니다.");
        // }
    });
  }, function(err){
    res.json({site: siteCd, msg: err});
  });
  // }

});

var approval = function (req, obj, callback){
  var db = req.con;

  var usrId = obj.usrId;
  var bussCd = obj.BUSSCD;
  var siteCd = obj.SITECD;
  var workYmd = obj.WORKYMD;
  var workerCd = obj.WORKERCD;
  var workTyp = obj.WORKTYP;
  var relatedTo = obj.RELATEDTO;
  var switchedWith = obj.SWITCHEDWITH;
  var status = obj.status;
  // bussCd = 'B000000001';

  var post = [status, usrId, mysql.raw("NOW()"), bussCd, siteCd, workYmd, workerCd, workTyp, "02"]
  // var where = [bussCd, siteCd, workYmd, workerCd, workTyp, "02"];

  var query = db.query("UPDATE SAS_SCHEDULE SET APPRSTATUS = ?, UPDBY = ?, UPDDTE = ? \n" +
      "WHERE BUSSCD = ? AND SITECD = ? AND WORKYMD = ? AND WORKERCD = ? AND WORKTYP = ? AND APPRSTATUS IN ('02', '03')"
    , post
    , function (error, results, fields) {
      if (error) {
        console.log(error);
        throw error;
      }

      console.log(query.sql);
      console.log('updated ' + results.affectedRows + ' rows');

      if(relatedTo){

        var relatedInfoArr = relatedTo.split("|");

        var post = [status, usrId, bussCd, siteCd, relatedInfoArr[0], relatedInfoArr[1], relatedInfoArr[2]]

        query = db.query("UPDATE SAS_SCHEDULE SET APPRSTATUS = ?, UPDBY = ?, UPDDTE = NOW() \n" +
                        "WHERE BUSSCD = ? AND SITECD = ? AND WORKYMD = ? AND WORKERCD = ? AND WORKTYP = ? AND APPRSTATUS IN ('02', '03')"
          , post
          , function (error, results, fields) {
            if (error) {
              console.log(error);
              throw error;
            }

            console.log(query.sql);
            console.log('updated ' + results.affectedRows + ' rows');

            if(switchedWith){
              post = [status, usrId, bussCd, siteCd, switchedWith]

              query = db.query("UPDATE SAS_SCHEDULE SET APPRSTATUS = ?, UPDBY = ?, UPDDTE = NOW() \n" +
                        "WHERE BUSSCD = ? AND SITECD = ? AND RELATEDTO = ? AND APPRSTATUS IN ('02', '03')"
                , post
                , function (error, results, fields) {
                  if (error) {
                    console.log(error);
                    throw error;
                  }

                  console.log(query.sql);
                  console.log('updated ' + results.affectedRows + ' rows');

                  var switchedWithInfoArr = switchedWith.split("|");

                  post = [status, usrId, bussCd, siteCd, switchedWithInfoArr[0], switchedWithInfoArr[1], switchedWithInfoArr[2]]

                  query = db.query("UPDATE SAS_SCHEDULE SET APPRSTATUS = ?, UPDBY = ?, UPDDTE = NOW() \n" +
                        "WHERE BUSSCD = ? AND SITECD = ? AND WORKYMD = ? AND WORKERCD = ? AND WORKTYP = ? AND APPRSTATUS IN ('02', '03')"
                    , post
                    , function (error, results, fields) {
                      if (error) {
                        console.log(error);
                        throw error;
                      }

                      console.log(query.sql);
                      console.log('updated ' + results.affectedRows + ' rows');

                      callback();

                  });
              });
            }else{
              callback();
            }
        });
      }else{
        callback();
      } 
  });
}

router.post('/approvalBatch', function(req, res, next){
  var objArr = JSON.parse(req.body.data);

  objArr.forEach(function(obj){
    approval(req, obj, function(){
    });
  });

  res.json({site: req.body.site});

});

router.post('/approval', function(req, res, next){
  var obj = req.body;
  // obj.bussCd = req.session.busscd;
  obj.usrId = req.session.usrId;
  
  // console.log(require("./workPlan.js"));

  approval(req, obj, function(){
    res.json({site: obj.SITECD});
  });

});

router.post('/reject', function(req, res, next){
  res.json("dfdfdf");
});

module.exports = router;
