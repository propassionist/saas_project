var express = require('express');
var router = express.Router();
var async = require('async');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('report');
});

router.get('/form', function(req, res, next) {

  var form = "";
  var mngPoint = "";

  mngPoint = {
    code : req.query.mngPointCd,
    name : req.query.mngPointName
  };
  if(req.query.rptType == 'A'){
    form = require("./req_report.json");
  }else if(req.query.rptType == 'B'){
    form = require("./clean_report.json");
  }

  res.render('reportForm', {data: form, mngPoint: mngPoint});
  
});

router.post('/save', function(req, res, next) {

  var db = req.con;

  var rptTitle = req.body.rptTitle;
  var rptSubtitle = req.body.rptSubtitle;
  var rptDesc = req.body.rptDesc;

  var post = {BUSSCD : req.session.busscd, RPTNM : rptTitle, RPTSUBNM : rptSubtitle,  DESC : rptDesc};

  db.query("INSERT INTO SAS_REPORT_MST SET ? ", post
  , function(error, results, fields) {
      if (error) {
          console.log(error);
          throw error;
      }

      console.log(results.insertId);
      var rptCd = results.insertId;

      
      var itemcnt = 1;
      if(Array.isArray(req.body.itemnm)){
        itemcnt = req.body.itemnm.length;
      }

      console.log('itemcnt :: ' + itemcnt);
      for(var i=0; i<itemcnt; i++){

        var itemnm = req.body.itemnm;
        var itemtyp = req.body.itemtype;
        if(Array.isArray(req.body.itemnm)){
          itemnm = req.body.itemnm[i];
          itemtyp = req.body.itemtype[i];
        }

        post = {RPTCD : rptCd, BUSSCD : req.session.busscd, ITEMNM : itemnm, ITEMTYP : itemtyp};

        db.query("INSERT INTO SAS_ITEM_MST SET ? ", post
        , function(error, results, fields) {
            if (error) {
                console.log(error);
                throw error;
            }

            console.log(results.insertId);

            var itemCd = results.insertId;

            // var item;                        
            var obj = JSON.parse(JSON.stringify(req.body));
            var itemKeyArr = obj["itemkey" + (i+1)];
            var itemValueArr = obj["itemvalue" + (i+1)];
              
            for(var j=0; j<itemKeyArr.length; j++){
              db.query("SELECT COUNT(*) CNT \n" +
                  "FROM SAS_ITEM_DTL \n" +
                  "WHERE ITEMCD = ? ", [itemCd]
              , function(error, results, fields) {
                  if (error) {
                      console.log(error);
                      throw error;
                  }

                  post = {ITEMCD : itemCd, SEQ : Number(results.CNT) + 1, BUSSCD : req.session.busscd, KEY : itemKeyArr[i], VALUE : itemValueArr[i]};

                  db.query("INSERT INTO SAS_ITEM_DTL SET ? ", post
                  , function(error, results, fields) {
                      if (error) {
                          console.log(error);
                          throw error;
                      }

                      res.render("report");
                  });
              });
            }
            
        });
      }

      // res.render('login', {data: data, msg: req.session.msg,});

  });

  

  // res.render('report', {data: form, mngPoint: mngPoint});
  
});

router.get('/reportEnd', function(req, res, next) {
  
  res.render('form/reportEnd');
  
});

module.exports = router;
