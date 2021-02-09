var express = require('express');
var router = express.Router();
var async = require('async');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('report');
});

router.post('/form', function(req, res, next) {

  var form = "";
  var mngPoint = "";

  mngPoint = {
    code : req.query.mngPointCd,
    name : req.query.mngPointName
  };
  if(req.body.rptCd == 'R202011002'){
    form = require("./req_report.json");
  }else if(req.body.rptCd == 'R202011003'){
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

      var itemnm = req.body.itemnm;
      var itemtyp = req.body.itemtype;      
      if(typeof req.body.itemnm === 'string'){
        itemnm = itemnm.split();
        itemtyp = itemtyp.split();
      }      
      
      
      // for(var i=0; i<itemcnt; i++){
      async.eachOf(itemnm, function(item, key, callback){
        var itemnm = req.body.itemnm;
        var itemtyp = req.body.itemtype;
        // if(Array.isArray(req.body.itemnm)){
        //   itemnm = req.body.itemnm[i];
        //   itemtyp = req.body.itemtype[i];
        // }

        post = {RPTCD : rptCd, BUSSCD : req.session.busscd, ITEMNM : item, ITEMTYP : itemtyp[key]};

        db.query("INSERT INTO SAS_ITEM_MST SET ? ", post
        , function(error, results, fields) {
            if (error) {
                console.log(error);
                throw error;
            }

            var itemCd = results.insertId;

            // var item;                        
            // var obj = JSON.parse(req.body);
            var itemKeyArr = req.body["itemkey" + (key+1)];
            var itemValueArr = req.body["itemvalue" + (key+1)];            
            
            // if(itemKeyArr){              
              async.eachOf(itemKeyArr, function(itemkey, key2, callback){
                console.log(item);
              console.log(itemCd);
              // for(var j=0; j<itemKeyArr.length; j++){
                db.query("SELECT COUNT(*) CNT \n" +
                    "FROM SAS_ITEM_DTL \n" +
                    "WHERE ITEMCD = ? ", [itemCd]
                , function(error, results, fields) {
                    if (error) {
                        console.log(error);
                        throw error;
                    }
                    
                    console.log(Number(results[0].CNT) + 1);
                    post = {ITEMCD : itemCd, SEQ : Number(results[0].CNT) + 1, BUSSCD : req.session.busscd, KEY : itemkey, VALUE : itemValueArr[key2]};

                    db.query("INSERT INTO SAS_ITEM_DTL SET ? ", post
                    , function(error, results, fields) {
                        if (error) {
                            console.log(error);
                            throw error;
                        }
                        console.log(db.query)

                        // callback(function(){
                        //   res.render("report");
                        // });
                    });
                });
              });
            // }
            // else{
            //   callback(function(){
            //     res.render("report");
            //   });
            // }
            
        });
      });

      // res.render('login', {data: data, msg: req.session.msg,});

  });

  

  // res.render('report', {data: form, mngPoint: mngPoint});
  
});

router.get('/reportEnd', function(req, res, next) {
  
  res.render('form/reportEnd');
  
});

module.exports = router;
