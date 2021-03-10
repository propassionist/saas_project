var express = require('express');
var router = express.Router();
var multer  = require('multer')
var upload = multer({ dest: 'public/images/corpCert' })
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
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

router.get('/update/:bussCd', function(req, res, next) {
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

													   
router.post('/update/:bussCd', function(req, res, next) {
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


router.post('/ocr', upload.single('profile_img'), async function (req, res, next) {
    console.log(JSON.stringify(req.body));
    console.log(req.file);
    // console.log(req.file.filename);
    console.log(req.body.url);

    let param = JSON.parse(JSON.stringify(req.body));

    var data = "";
    var jsonParams = {
        "images": [
          {
            "format": "jpg",
            "name": "demo",
            "data": null,
            "url": "http://www.ajugeotec.co.kr/static/images/sub/sheet_l1.jpg"
          }
        ],
        "lang": "ko",
        "requestId": "string",
        "resultType": "string",
        "timestamp": "1614840923218",
        "version": "V2"
    };
      var url  = "https://8a8e066ec00143cab750e38af4e16ec7.apigw.ntruss.com/custom/v1/7252/18838a299fc757699cebbc432313d75faf3acc713db49590ed8694922f06cfc1/infer";   // API 호출 url
      var headers = {
          "Content-type" : "application/json" // JSON header
        , "X-OCR-SECRET" : "bW5SQkNxc3BmU3FPSGVlTE1mdmtPZGl2eERjbnNBU2o="
      };
      var request = require('request');
      var options = {
        url: url,
        headers: headers,
        method: 'POST',
        json: true,
        body:jsonParams
      };
      var data = '';
      await request(options, function (error, response, body) {
        console.log("!!!!!!! : " + error + "," + response);
        if (!error && response.statusCode == 200) {
          // console.log(body) // Print the shortened url.
          var result=JSON.stringify(body.images[0].fields);
          console.log(JSON.parse(result));
          data = JSON.parse(result);
          console.log(">>>>>>>>>>>>> " + data);
        }
      });
      await test();
      // var BUSSNM = '';
      // var PUBLYMD = '';
      // var CHIEF = '';
      // var BUSSNO = '';
      // var ADDR = '';
      var ocrMap = [{
        BUSSNM : '',
        PUBLYMD : '',
        CHIEF : '',
        BUSSNO : '',
        ADDR : ''
      }];
      for(var i = 0 ; i < data.length; i ++){
        console.log(data[i]);
        if(data[i].name == "회사명"){
          ocrMap[0].BUSSNM = data[i].inferText;
        }else if(data[i].name == "설립일자"){
          var publymd = data[i].inferText.replace(/[^0-9]/g,'')
          console.log(publymd);
          ocrMap[0].PUBLYMD = publymd.substring(0,4) + "-" + publymd.substring(4,6) + "-" + publymd.substring(6,8);
        }else if(data[i].name == "대표자명"){
          ocrMap[0].CHIEF = data[i].inferText;
        }else if(data[i].name == "사업자번호"){
          ocrMap[0].BUSSNO = data[i].inferText;
        }else if(data[i].name == "주소"){
          ocrMap[0].ADDR = data[i].inferText;
        }
      }
      console.log(">>>>>>>>>>>>>>>>>>>" + JSON.stringify(ocrMap[0]));
      res.render('bussForm', {data: ocrMap});
  })

  function test() {
    return new Promise(resolve => {
      setTimeout(() => 
        resolve(''), 3000);
    })
  }
  

module.exports = router;
