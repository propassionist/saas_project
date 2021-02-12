var express = require('express');
var router = express.Router();
var async = require('async');
var mysql = require('mysql');

/* GET home page. */
router.get('/', function (req, res, next) {

  var db = req.con;

  var query = db.query("SELECT * FROM SAS_REPORT_MST WHERE BUSSCD = ?"
    // , [req.session.busscd], function (error, results, fields) {
    , ['B000000000'], function (error, results, fields) {
      if (error) {
        console.log(error);
        throw error;
      }

      console.log(query.sql);
      console.log(results);

      res.render('report', { data: results });

    });

});

router.get('/form', function (req, res, next) {

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

router.post('/formaa', function (req, res, next) {

  var db = req.con;
  var form = "";
  var mngPoint = "";
  var data = "";

  mngPoint = {
    code: req.query.mngPointCd,
    name: req.query.mngPointName
  };

  var query = db.query("SELECT * \n" +
    "FROM SAS_REPORT_MST \n" +
    "WHERE BUSSCD = ? AND RPTCD = ?"
    // , [req.session.busscd, req.body.rptCd], function (error, results, fields) {
    , ['B000000000', req.body.rptCd], function (error, results, fields) {
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
        "ORDER BY A.ITEMCD"
        // , [req.session.busscd, req.body.rptCd], function (error, results, fields) {
        , ['B000000000', req.body.rptCd], function (error, results, fields) {
          if (error) {
            console.log(error);
            throw error;
          }

          console.log(query.sql);
          data.itemlist = results;

          async.forEachOf(results, function (item, key, callback) {
            query = db.query("SELECT A.SEQ, A.KEY, A.VALUE \n" +
              "FROM SAS_ITEM_DTL A \n" +
              "WHERE A.BUSSCD = ? AND A.ITEMCD = ? \n" +
              "ORDER BY A.SEQ"
              // , [req.session.busscd, req.body.rptCd], function (error, results, fields) {
              , ['B000000000', item.ITEMCD], function (error, results, fields) {
                if (error) {
                  console.log(error);
                  throw error;
                }

                console.log(query.sql);
                // console.log(results);
                data.itemlist[key].itemkeylist = results;

                callback();
              }).then(function () {
                res.render('reportForm', { data: data, mngPoint: mngPoint });
              });

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

  var rptTitle = req.body.rptTitle;
  var rptSubtitle = req.body.rptSubtitle;
  var rptDesc = req.body.rptDesc;
  var rptCd = "";
  // var bussCd = req.session.busscd;
  // var siteCd = req.session.sitecd;
  var bussCd = 'B000000001';
  var siteCd = 'S0001';

  //RPTCD 추출
  var query = db.query("SELECT GET_RPTCD('" + bussCd + "', '" + siteCd + "') RPTCD FROM DUAL"
  , function (error, results, fields) {
    if (error) {
      console.log(error);
      throw error;
    }

    //RPTCD세팅
    console.log(query.sql);

    rptCd = results[0].RPTCD;

    post = {
      RPTCD: rptCd,
      BUSSCD: bussCd,
      SITECD: req.session.sitecd,
      RPTNM: rptTitle,
      RPTSUBNM: rptSubtitle,
      DESC: rptDesc
    };

    //RPT입력
    query = db.query("INSERT INTO SAS_REPORT_MST SET ?", post
    , function (error, results, fields) {
      if (error) {
        console.log(error);
        throw error;
      }

      console.log(query.sql);

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

      //ITEM순회
      itemnm.forEach(async function(item, key){
        //ITEMCD추출
        var itemCd = "";

        var query = await db.query("SELECT GET_ITEMCD('" + bussCd + "', '" + rptCd + "') ITEMCD FROM DUAL"
        , function (error, results, fields) {
          if (error) {
            console.log(error);
            throw error;
          }

          console.log(query.sql);

          itemCd = results[0].ITEMCD;
          
        });//ITEMCD추출

        post = { RPTCD: rptCd, ITEMCD: itemCd, BUSSCD: bussCd, ITEMNM: item, ITEMTYP: itemtyp[key]};

        //ITEM입력
        query = await db.query("INSERT INTO SAS_ITEM_MST SET ? ", post
        , function (error, results, fields) {
          if (error) {
            console.log(error);
            throw error;
          }

          console.log(query.sql);

          var itemCd = results.insertId;
          var itemKeyArr = req.body["itemkey" + (key + 1)];
          var itemValueArr = req.body["itemvalue" + (key + 1)];

        });//ITEM입력

        post = { ITEMCD: itemCd, SEQ: mysql.raw("COALESCE(MAX(SEQ), 0) + 1"), BUSSCD: bussCd, KEY: itemkey, VALUE: itemValueArr[key2] };

        //ITEM KEY,VAUE 순회
        itemKeyArr.forEach(async function(itemkey, key2){
          var query = "INSERT INTO SAS_ITEM_DTL SET ? ";

          //ITEM KEY,VALUE 입력
          query = await db.query(query, post
            , function (error, results, fields) {
              if (error) {
                console.log(error);
                throw error;
              }

              console.log(query.sql);

          });//ITEM KEY,VALUE 입력
        });//ITEM KEY,VAUE 순회
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

            var itemCd = results.insertId;
            var itemKeyArr = req.body["itemkey" + (key + 1)];
            var itemValueArr = req.body["itemvalue" + (key + 1)];

            // if(itemKeyArr){              
            async.eachOf(itemKeyArr, function (itemkey, key2, callback) {
              var query = "INSERT INTO SAS_ITEM_DTL SET ? ";

              post = { ITEMCD: itemCd, SEQ: key2, BUSSCD: req.session.busscd, KEY: itemkey, VALUE: itemValueArr[key2] };

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

router.get('/reportEnd', function (req, res, next) {

  res.render('form/reportEnd');

});

module.exports = router;
