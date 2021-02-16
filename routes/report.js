var express = require('express');
var router = express.Router();
var async = require('async');
var mysql = require('mysql');

/* GET home page. */
router.get('/', function (req, res, next) {

  var db = req.con;
  // var bussCd = req.session.busscd;
  var bussCd = 'B000000001';

  var query = db.query("SELECT * FROM SAS_REPORT_MST WHERE BUSSCD = ?"
    // , [req.session.busscd], function (error, results, fields) {
    , ['B000000001'], function (error, results, fields) {
      if (error) {
        console.log(error);
        throw error;
      }

      console.log(query.sql);
      console.log(results);

      res.render('report', { data: results });

    });

});

router.get('/formaa', function (req, res, next) {

  var db = req.con;
  var form = "";
  var mngPoint = "";
  // var data = [];

  mngPoint = {
    code: req.query.mngPointCd,
    name: req.query.mngPointName
  };

  if (req.query.rptCd == 'R202011002') {
    form = require("./req_report.json");
  } else if (req.query.rptCd == 'R202011003') {
    form = require("./clean_report.json");
  }

  form.RPTCD = "dfdfdf";
  // data.push(form);

  res.render('reportForm', { data: form, mngPoint: mngPoint });

});

router.get('/form', function (req, res, next) {

  res.render('reportForm', { data: "" });

});

router.post('/delete', function (req, res, next) {

  var db = req.con;
  // var bussCd = req.session.busscd;
  // var siteCd = req.session.sitecd;
  var bussCd = 'B000000001';
  // var siteCd = 'S0001';
  var rptCd = req.body.rptCd;

  var query = db.query("DELETE FROM SAS_REPORT_MST WHERE BUSSCD = ? AND RPTCD = ? "
    , [bussCd, rptCd], function (error, results, fields) {
      if (error) {
        console.log(error);
        throw error;
      }

      console.log(query.sql);
      console.log('deleted ' + results.affectedRows + ' rows');

      query = db.query("DELETE FROM SAS_ITEM_MST WHERE RPTCD = ? "
        , [rptCd], function (error, results, fields) {
          if (error) {
            console.log(error);
            throw error;
          }

          console.log(query.sql);
          console.log('deleted ' + results.affectedRows + ' rows');

          query = db.query("DELETE FROM SAS_ITEM_DTL WHERE RPTCD = ? "
            , [rptCd], function (error, results, fields) {
              if (error) {
                console.log(error);
                throw error;
              }

              console.log(query.sql);
              console.log('deleted ' + results.affectedRows + ' rows');

              res.redirect("/report");

            });
        });
    });

});

router.get('/view', function (req, res, next) {
  var db = req.con;
  var form = "";
  var mngPoint = "";
  var data = "";
  // var bussCd = req.session.busscd;
  // var rowIdx = req.body.rowIdx;

  var bussCd = req.query.bussCd;
  var rptCd = req.query.rptCd;
  
  var modalData = new Object();
  var viewType = req.query.viewType;
  var workCd = req.query.workCd;
  var isWorkCd = !(req.query.workCd == undefined || req.query.workCd == "");

  modalData.viewType = viewType;
  modalData.workCd = workCd;

  var mngPoint = {
    code: req.query.mngPointCd,
    name: req.query.mngPointNm
  };

  var query = db.query("SELECT * \n" +
    "FROM SAS_REPORT_MST A \n" +
    "WHERE BUSSCD = ? AND RPTCD = ?"
    // , [req.session.busscd, req.body.rptCd], function (error, results, fields) {
    , [bussCd, rptCd], function (error, results, fields) {
      if (error) {
        console.log(error);
        throw error;
      }

      console.log(query.sql);
      data = results[0];

      var sqlStr = "SELECT A.ITEMCD, A.ITEMNM, A.ITEMTYP"+ (isWorkCd ? ", B.RESULT" : "") +"  \n" +
                          "FROM SAS_ITEM_MST A \n";
            if(isWorkCd){
                sqlStr += "LEFT OUTER JOIN (SELECT WORKCD, RPTCD, ITEMCD, MAX(RESULT) RESULT FROM SAS_WORK_RPT GROUP BY WORKCD, RPTCD, ITEMCD) B ON B.WORKCD = '" + workCd + "' AND A.RPTCD = B.RPTCD AND A.ITEMCD = B.ITEMCD \n";
            }
            sqlStr +=    "WHERE A.BUSSCD = ? AND A.RPTCD = ? \n" +
                          "ORDER BY A.SORTSEQ";

      query = db.query(sqlStr
        // , [req.session.busscd, req.body.rptCd], function (error, results, fields) {
        , [bussCd, rptCd], function (error, results, fields) {
          if (error) {
            console.log(error);
            throw error;
          }

          console.log(query.sql);
          data.itemlist = results;

          async.forEachOf(results, function (item, key, callback) {
            sqlStr = "SELECT A.SEQ, A.KEY, A.VALUE"+ (isWorkCd ? ", B.RESULT" : "") +"  \n" +
                          "FROM SAS_ITEM_DTL A \n";
            if(isWorkCd){
                sqlStr += "LEFT OUTER JOIN SAS_WORK_RPT B ON B.WORKCD = '" + workCd + "' AND A.RPTCD = B.RPTCD AND A.ITEMCD = B.ITEMCD AND A.KEY = B.RESULT \n";
            }
            sqlStr +=    "WHERE A.RPTCD = ? AND A.ITEMCD = ? \n" +
                          "ORDER BY A.SORTSEQ";
            query = db.query(sqlStr
              // , [req.session.busscd, req.body.rptCd], function (error, results, fields) {
              , [rptCd, item.ITEMCD], function (error, results, fields) {
                if (error) {
                  console.log(error);
                  throw error;
                }

                console.log(query.sql);
                // console.log(results);
                data.itemlist[key].itemkeylist = results;

                callback();
              })
          }, function (err) {

            var url = "./form/report";

            if(viewType == "modal"){
              url = "./form/reportBody"  
            }

            res.render(url, { data: data, mngPoint: mngPoint, modalData: modalData });
            // res.render('reportForm', { data: data, mngPoint: mngPoint });
          });

        });

      // if (req.body.rptCd == 'R202011002') {
      //   form = require("./req_report.json");
      // } else if (req.body.rptCd == 'R202011003') {
      //   form = require("./clean_report.json");
      // }

    });
});

router.post('/form', function (req, res, next) {

  var db = req.con;
  var form = "";
  var mngPoint = "";
  var data = "";
  // var bussCd = req.session.busscd;
  var rowIdx = req.body.rowIdx;
  var bussCd = req.body.bussCd[rowIdx];
  var rptCd = req.body.rptCd[rowIdx];

  mngPoint = {
    code: req.query.mngPointCd,
    name: req.query.mngPointName
  };

  var query = db.query("SELECT * \n" +
    "FROM SAS_REPORT_MST \n" +
    "WHERE BUSSCD = ? AND RPTCD = ?"
    // , [req.session.busscd, req.body.rptCd], function (error, results, fields) {
    , [bussCd, rptCd], function (error, results, fields) {
      if (error) {
        console.log(error);
        throw error;
      }

      console.log(query.sql);
      data = results[0];

      // query = db.query("SELECT A.ITEMCD, A.ITEMNM, A.ITEMTYP, B.SEQ, B.KEY, B.VALUE \n" + 
      //                 "FROM SAS_ITEM_MST A \n" +
      //                 "LEFT OUTER JOIN SAS_ITEM_DTL B ON A.BUSSCD = B.BUSSCD AND A.SITECD = B.SITECD AND A.ITEMCD = B.ITEMCD \n" +
      //                 "WHERE A.BUSSCD = ? AND A.RPTCD = ?"
      //                 // , [req.session.busscd, req.body.rptCd], function (error, results, fields) {
      //                 , ['B000000000', req.body.rptCd], function (error, results, fields) {
      query = db.query("SELECT A.ITEMCD, A.ITEMNM, A.ITEMTYP \n" +
        "FROM SAS_ITEM_MST A \n" +
        "WHERE A.BUSSCD = ? AND A.RPTCD = ? \n" +
        "ORDER BY A.SORTSEQ"
        // , [req.session.busscd, req.body.rptCd], function (error, results, fields) {
        , [bussCd, rptCd], function (error, results, fields) {
          if (error) {
            console.log(error);
            throw error;
          }

          console.log(query.sql);
          data.itemlist = results;

          async.forEachOf(results, function (item, key, callback) {
            query = db.query("SELECT A.SEQ, A.KEY, A.VALUE \n" +
              "FROM SAS_ITEM_DTL A \n" +
              "WHERE A.RPTCD = ? AND A.ITEMCD = ? \n" +
              "ORDER BY A.SORTSEQ"
              // , [req.session.busscd, req.body.rptCd], function (error, results, fields) {
              , [rptCd, item.ITEMCD], function (error, results, fields) {
                if (error) {
                  console.log(error);
                  throw error;
                }

                console.log(query.sql);
                // console.log(results);
                data.itemlist[key].itemkeylist = results;

                callback();
              })
          }, function (err) {
            res.render('reportForm', { data: data, mngPoint: mngPoint });
          });

        });

      // if (req.body.rptCd == 'R202011002') {
      //   form = require("./req_report.json");
      // } else if (req.body.rptCd == 'R202011003') {
      //   form = require("./clean_report.json");
      // }

    });
});

router.post('/save', function (req, res, next) {
  var db = req.con;

  var rptCd = req.body.rptCd;
  var rptTitle = req.body.rptTitle;
  var rptSubtitle = req.body.rptSubtitle;
  var rptDesc = req.body.rptDesc;

  // var bussCd = req.session.busscd;
  // var siteCd = req.session.sitecd;
  var bussCd = 'B000000001';
  var siteCd = 'S0001';

  //RPTCD 추출
  var query = db.query("SELECT GET_RPTCD() RPTCD FROM DUAL"
    , function (error, results, fields) {
      if (error) {
        console.log(error);
        throw error;
      }

      //RPTCD세팅
      console.log(query.sql);

      if (rptCd == '')
        rptCd = results[0].RPTCD;

      post = {
        RPTCD: rptCd,
        BUSSCD: bussCd,
        SITECD: siteCd,
        RPTNM: rptTitle,
        RPTSUBNM: rptSubtitle,
        DESC: rptDesc
      };

      //RPT입력
      query = db.query("INSERT INTO SAS_REPORT_MST SET ? ON DUPLICATE KEY UPDATE RPTNM = '" + rptTitle + "', RPTSUBNM = '" + rptSubtitle + "', `DESC` = '" + rptDesc + "'", post
        , function (error, results, fields) {
          if (error) {
            console.log(error);
            throw error;
          }

          console.log(query.sql);
          console.log('inserted ' + results.affectedRows + ' rows');

          var itemCdDelStatusArr = req.body.itemcd_delstatus;
          var itemCdArr = req.body.itemcd;
          var itemNmArr = req.body.itemnm;
          var itemTypArr = req.body.itemtype;
          if (typeof req.body.itemnm === 'string') {
            itemCdDelStatusArr = itemCdDelStatusArr.split();
            itemCdArr = itemCdArr.split();
            itemNmArr = itemNmArr.split();
            itemTypArr = itemTypArr.split();
          }

          //ITEM순회
          // itemnm.forEach(async function(item, key)
          async.eachOfSeries(itemCdArr, function (itemCd, key, callback) {

            var itemCdVal = "";
            if (itemCd != '')
              itemCdVal = itemCd;

            //ITEM삭제 여부 체크 (삭제 상태값 'Y' => 쿼리 수행 제외)
            if (itemCdDelStatusArr[key] != "Y") {
              //ITEMCD추출
              var query = db.query("SELECT GET_ITEMCD('" + rptCd + "') ITEMCD FROM DUAL"
                , function (error, results, fields) {
                  if (error) {
                    console.log(error);
                    throw error;
                  }

                  console.log(query.sql);

                  if (itemCdVal == "")
                    itemCdVal = results[0].ITEMCD;

                  post = { RPTCD: rptCd, ITEMCD: itemCdVal, BUSSCD: bussCd, ITEMNM: itemNmArr[key], ITEMTYP: itemTypArr[key], SORTSEQ: key };

                  //ITEM입력
                  query = db.query("INSERT INTO SAS_ITEM_MST SET ? ON DUPLICATE KEY UPDATE ITEMNM = '" + itemNmArr[key] + "', ITEMTYP = '" + itemTypArr[key] + "', SORTSEQ = '" + key + "'", post
                    , function (error, results, fields) {
                      if (error) {
                        console.log(error);
                        throw error;
                      }

                      console.log(query.sql);
                      console.log('inserted ' + results.affectedRows + ' rows');

                      var itemSeqDelStatusArr = req.body["itemseq_delstatus" + (key + 1)];
                      console.log((key + 1) + " : " + itemSeqDelStatusArr);
                      var itemSeqArr = req.body["itemseq" + (key + 1)];
                      var itemKeyArr = req.body["itemkey" + (key + 1)];
                      var itemValueArr = req.body["itemvalue" + (key + 1)];

                      //ITEM KEY,VAUE 순회
                      // itemKeyArr.forEach(async function(itemkey, key2){
                      async.eachOfSeries(itemSeqArr, function (itemSeq, key2, callback2) {

                        var seq = "";
                        if (itemSeq != '')
                          seq = itemSeq;

                        if (itemSeqDelStatusArr == undefined || itemSeqDelStatusArr[key2] != "Y") {
                          //ITEM SEQ 추출
                          var query = db.query("SELECT GET_ITEMCDSEQ('" + rptCd + "', '" + itemCdVal + "') SEQ FROM DUAL"
                            , function (error, results, fields) {
                              if (error) {
                                console.log(error);
                                throw error;
                              }

                              console.log(query.sql);

                              if (seq == "")
                                seq = results[0].SEQ;

                              post = { RPTCD: rptCd, ITEMCD: itemCdVal, SEQ: seq, BUSSCD: bussCd, KEY: itemKeyArr[key2], VALUE: itemValueArr[key2], SORTSEQ: key2 };

                              //ITEM KEY,VALUE 입력
                              query = db.query("INSERT INTO SAS_ITEM_DTL SET ? ON DUPLICATE KEY UPDATE `KEY` = '" + itemKeyArr[key2] + "', VALUE = '" + itemValueArr[key2] + "', SORTSEQ = '" + key2 + "'", post
                                , function (error, results, fields) {
                                  if (error) {
                                    console.log(error);
                                    throw error;
                                  }

                                  console.log(query.sql);
                                  console.log('inserted ' + results.affectedRows + ' rows');

                                  callback2();

                                });//ITEM KEY,VALUE 입력

                            });//ITEM SEQ 추출
                        } else {// ITEM_DTL KEY, VALUE 삭제
                          var query = db.query("DELETE FROM SAS_ITEM_DTL WHERE RPTCD = ? AND ITEMCD = ? AND SEQ = ?", [rptCd, itemCdVal, seq]
                            , function (error, results, fields) {
                              if (error) {
                                console.log(error);
                                throw error;
                              }

                              console.log(query.sql);
                              console.log('deleted ' + results.affectedRows + ' rows');

                              callback2();
                            });
                        }// ITEM_DTL KEY, VALUE 삭제
                      }, function (err) {
                        callback();
                      });//ITEM KEY,VAUE 순회
                    });//ITEM입력
                });//ITEMCD추출
            } else { //ITEM 삭제 수행
              //ITEM_MST 삭제
              var query = db.query("DELETE FROM SAS_ITEM_MST WHERE RPTCD = ? AND ITEMCD = ?", [rptCd, itemCdVal]
                , function (error, results, fields) {
                  if (error) {
                    console.log(error);
                    throw error;
                  }

                  console.log(query.sql);
                  console.log('deleted ' + results.affectedRows + ' rows');

                  //ITEM_DTL 숙제
                  query = db.query("DELETE FROM SAS_ITEM_DTL WHERE RPTCD = ? AND ITEMCD = ?", [rptCd, itemCdVal]
                    , function (error, results, fields) {
                      if (error) {
                        console.log(error);
                        throw error;
                      }

                      console.log(query.sql);
                      console.log('deleted ' + results.affectedRows + ' rows');

                      callback();
                    });//ITEM_DTL 삭제
                });//ITEM_MST 삭제
            }//ITEM 삭제 수행
          }, function (err) {
            res.redirect('/report');
          });//ITEM순회
        });//RPT입력
    });//RPTCD추출

});

router.post('/savedfdf', function (req, res, next) {

  var db = req.con;

  var rptTitle = req.body.rptTitle;
  var rptSubtitle = req.body.rptSubtitle;
  var rptDesc = req.body.rptDesc;

  var post = {
    RPTCD: mysql.raw("get_rptcd('" + req.session.bussCd + "', '" + req.session.sitecd + "')"),
    BUSSCD: req.session.busscd,
    SITECD: req.session.sitecd,
    RPTNM: rptTitle,
    RPTSUBNM: rptSubtitle,
    DESC: rptDesc
  };

  // db.beginTransaction(function (err) {

  db.query("INSERT INTO SAS_REPORT_MST SET ?", post
    , function (error, results, fields) {
      if (error) {
        console.log(error);
        throw error;
      }

      var rptCd = results.insertId;

      var itemcnt = 1;
      if (Array.isArray(req.body.itemnm)) {
        itemcnt = req.body.itemnm.length;
      }

      var itemnm = req.body.itemnm;
      var itemtyp = req.body.itemtype;
      if (typeof req.body.itemnm === 'string') {
        itemnm = itemnm.split();
        itemtyp = itemtyp.split();
      }

      // async.eachOf(itemnm, function (item, key, callback) {
      async.eachOf(itemnm, function (item, key, callback) {
        var itemnm = req.body.itemnm;
        var itemtyp = req.body.itemtype;

        post = { RPTCD: rptCd, ITEMCD: mysql.raw("get_itemcd('" + req.session.busscd + "', '" + rptcd + "')"), BUSSCD: req.session.busscd, ITEMNM: item, ITEMTYP: itemtyp[key] };

        db.query("INSERT INTO SAS_ITEM_MST SET ? ", post
          , function (error, results, fields) {
            if (error) {
              console.log(error);
              throw error;
            }

            var itemCd = results.insertId;
            var itemKeyArr = req.body["itemkey" + (key + 1)];
            var itemValueArr = req.body["itemvalue" + (key + 1)];

            // if(itemKeyArr){              
            async.eachOf(itemKeyArr, function (itemkey, key2, callback) {
              var query = "INSERT INTO SAS_ITEM_DTL SET ? ";

              post = { ITEMCD: itemCd, SEQ: mysql.raw("get_itemcdseq('" + req.session.busscd + "', '" + itemCd + "')"), BUSSCD: req.session.busscd, KEY: itemkey, VALUE: itemValueArr[key2] };

              var query = db.query(query, post
                , function (error, results, fields) {
                  if (error) {
                    console.log(error);
                    throw error;
                  }

                  console.log("" + key + key2 + " : " + query.sql);

                });
            });
          });
      }).then(function () {
        res.redirect('/report');
      });

      // res.render('login', {data: data, msg: req.session.msg,});

    });
  // });



  // res.render('report', {data: form, mngPoint: mngPoint});

});

router.post('/update', function (req, res, next) {

  var db = req.con;

  var rptTitle = req.body.rptTitle;
  var rptSubtitle = req.body.rptSubtitle;
  var rptDesc = req.body.rptDesc;

  var post = { BUSSCD: req.session.busscd, RPTNM: rptTitle, RPTSUBNM: rptSubtitle, DESC: rptDesc };

  // db.beginTransaction(function (err) {

  db.query("INSERT INTO SAS_REPORT_MST SET ? ", post
    , function (error, results, fields) {
      if (error) {
        console.log(error);
        throw error;
      }

      var rptCd = results.insertId;


      var itemcnt = 1;
      if (Array.isArray(req.body.itemnm)) {
        itemcnt = req.body.itemnm.length;
      }

      var itemnm = req.body.itemnm;
      var itemtyp = req.body.itemtype;
      if (typeof req.body.itemnm === 'string') {
        itemnm = itemnm.split();
        itemtyp = itemtyp.split();
      }

      async.eachOf(itemnm, function (item, key, callback) {
        var itemnm = req.body.itemnm;
        var itemtyp = req.body.itemtype;

        post = { RPTCD: rptCd, BUSSCD: req.session.busscd, ITEMNM: item, ITEMTYP: itemtyp[key] };

        db.query("INSERT INTO SAS_ITEM_MST SET ? ", post
          , function (error, results, fields) {
            if (error) {
              console.log(error);
              throw error;
            }

            // var itemCd = results.insertId;
            var itemKeyArr = req.body["itemkey" + (key + 1)];
            var itemValueArr = req.body["itemvalue" + (key + 1)];

            // if(itemKeyArr){              
            async.eachOf(itemKeyArr, function (itemkey, key2, callback) {
              var query = "INSERT INTO SAS_ITEM_DTL SET ? ";

              post = { ITEMCD: itemCdVal, SEQ: key2, BUSSCD: req.session.busscd, KEY: itemkey, VALUE: itemValueArr[key2] };

              var query = db.query(query, post
                , function (error, results, fields) {
                  if (error) {
                    console.log(error);
                    throw error;
                  }

                  console.log("" + key + key2 + " : " + query.sql);

                });
            });
          });
      }).then(function () {
        res.redirect('/report');
      });

      // res.render('login', {data: data, msg: req.session.msg,});

    });
  // });



  // res.render('report', {data: form, mngPoint: mngPoint});

});

router.post('/reportEnd', function (req, res, next) {

  var db = req.con;

  // if (true) {
  //   res.end();
  // }

  var d = new Date();
  var today = "" + d.getFullYear() + (d.getMonth() + 1 < 10 ? "0" + (d.getMonth() + 1) : d.getMonth() + 1) + d.getDate();
  var time = d.toLocaleString();

  var viewType = req.body.viewType;
  var bussCd = req.body.bussCd;
  var siteCd = req.body.siteCd;
  var workCd = req.body.workCd;
  var workDte = today;
  var workNm = req.body.rptNm + "(" + time + ")";
  var mngPointCd = req.body.mngPointCd;
  var rptCd = req.body.rptCd;
  var itemCdList = req.body.itemCdList;
  var itemCdListArr = itemCdList.split(",");

  var query = db.query("SELECT GET_WORKCD() WORKCD FROM DUAL"
    , function (error, results, fields) {
      if (error) {
        console.log(error);
        throw error;
      }

      console.log(query.sql);

      var sqlStr = "";
      var post = new Object();

      if(workCd == undefined || workCd == ""){
        workCd = results[0].WORKCD;

        sqlStr = "INSERT INTO SAS_WORK SET ? ";
        post = {
          BUSSCD: bussCd,
          SITECD: siteCd,
          WORKCD: workCd,
          WORKDTE: workDte,
          WORKNM: workNm,
          MNGPOINTCD: mngPointCd,
          RPTCD: rptCd
        };
      }else{
        sqlStr = "DELETE FROM SAS_WORK_RPT WHERE ? ";
        post = {
          WORKCD: workCd
        };
      }

      query = db.query(sqlStr, post
        , function (error, results, fields) {
          if (error) {
            console.log(error);
            throw error;
          }

          console.log('inserted ' + results.affectedRows + ' rows');

          // if(itemKeyArr){              
          async.eachOf(itemCdListArr, function (itemCd, key, callback) {

            var itemKeyArr = req.body["item_" + itemCd];
            if(typeof itemKeyArr == "string")
              itemKeyArr = itemKeyArr.split();

            async.eachOf(itemKeyArr, function (itemKey, key, callback2) {

              post = { WORKCD: workCd, RPTCD: rptCd, ITEMCD: itemCd, RESULT: itemKey };

              query = db.query("INSERT INTO SAS_WORK_RPT SET ? ", post
                , function (error, results, fields) {
                  if (error) {
                    console.log(error);
                    throw error;
                  }

                  console.log('inserted ' + results.affectedRows + ' rows');

                  callback2();

                });
            }, function (err, results) {
              callback();
            });
          }, function (err, results) {

            if(viewType == "modal"){
              res.redirect('/work');
            }else{
              res.render('form/reportEnd');
            }

          });

        });

    });

});

module.exports = router;
