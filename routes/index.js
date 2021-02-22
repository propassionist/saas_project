var express = require('express');
const session = require('express-session');
var router = express.Router();

/*
  최초 화면(로그인화면) 진입 전 로직
*/
router.get('/', function(req, res, next) {
  var db = req.con;
  var data = '';

  db.query("SELECT * \n" +
           "FROM SAS_BUSS \n" +
           "WHERE DOMAIN = '" + req.headers.host + "'"
  , function(error, results, fields) {
      if (error) {
          console.log(error);
          throw error;
      }
      
      data = results;

      if(data.length > 0){
        req.session.isLogined = false;
        req.session.busscd = data[0].BUSSCD;
        req.session.bussnm = data[0].BUSSNM;
        data.idCheck = req.cookies.idCheck
        data.usrId = req.cookies.usrId
      }

      console.log(data);

      res.render('login', {data: data, msg: req.session.msg,});

  });

});

/*
  로그인
*/
router.post('/login', function(req, res, next) {
  var db = req.con;
  var data = '';
  
  console.log('------login-------')
  console.log(req.body);  

  db.query("SELECT * \n" +
           "FROM SAS_USER \n" +
           "WHERE BUSSCD = '" + req.session.busscd + "' AND USRID = '" + req.body.usrId + "' AND PASSWD = '" + req.body.passwd + "'" 
  , function(error, results, fields) {
      if (error) {
          console.log(error);
          throw error;
      }
      
      data = results;
      console.log(data);

      if(data.length > 0){ // 로그인 성공 시
        req.session.isLogined = true; // login 플래그 true 세팅
        req.cookies.idCheck = req.body.idCheck; // 로그인 화면 ; id 기억 cookie 저장
        req.cookies.usrId = data[0].USRID;
        req.session.usrId = data[0].USRID;
        req.session.name = data[0].NAME;
        // res.render('index', { title: req.session.bussnm });
        res.redirect('/intro');
      }else{
        req.session.msg = '아이디 및 패스워드를 확인해주십시오.'
        res.redirect('/');
      }
  });
});

/*
  로그아웃
*/
router.get('/logout', function(req, res, next) {
  res.header('Cache-Control', 'no-cache');
  req.session.destroy(); //세션종료
  res.redirect('/'); //로그인 화면으로 리다이렉트
});

/*
  인트로
*/
router.get('/intro', function(req, res, next) {
  res.render('index', { title: req.session.bussnm });
});

// db 사용 예 get or post로 서비스 구성 가능
router.get('/dbTest', function(req, res, next) {

  var db = req.con;
  var data = "";

  db.query("SELECT * \n" +
           "FROM SAS_CORP_MAST"
      , function(error, results, fields) {
          if (error) {
              console.log(error);
              throw error;
          }

          data = results;

          res.render('dbTest', {data: data});
      });
});

// db 사용 예 get or post로 서비스 구성 가능
router.get('/dbTest', function(req, res, next) {

  var db = req.con;
  var data = "";

  db.query("SELECT * \n" +
           "FROM SAS_CORP_MAST"
      , function(error, results, fields) {
          if (error) {
              console.log(error);
              throw error;
          }

          data = results;

          res.render('dbTest', {data: data});
      });
});

router.get('/dbTestInsert', function(req, res, next) {

  var db = req.con;
  var data = "";

  db.query("SELECT * \n" +
           "FROM SAS_CORP_MAST"
      , function(error, results, fields) {
          if (error) {
              console.log(error);
              throw error;
          }

          data = results;

          res.render('dbTest', {data: data});
      });
});

router.get('/test', function(req, res, next) {
  res.render('test');
});

router.post('/testForm', function(req, res, next) {
  res.render('test');
});

router.get('/dbTestDelete', function(req, res, next) {

  var db = req.con;
  var data = "";

  db.query("DELETE * \n" +
           "FROM SAS_CORP_MAST"
      , function(error, results, fields) {
          if (error) {
              console.log(error);
              throw error;
          }

          data = results;

          res.render('dbTest', {data: data});
      });
});

<<<<<<< HEAD
=======
// 채기모 시작
// 1. 회사관리
router.get('/buss', function(req, res, next) {

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

													  

// 1. 사업장관리
router.get('/site', function(req, res, next) {

  var db = req.con;
  var data = "";
  var bussCd = req.session.bussCd;

  const sql = "SELECT * \n" +
              "  FROM HWHNR.SAS_SITE A    \n" +
              "     , HWHNR.SAS_BUSS B    \n" +
              " WHERE A.BUSSCD = B.BUSSCD \n" +
              "   AND A.BUSSCD = ? \n" +
              " ORDER BY A.BUSSCD, A.SITECD";

  db.query(sql, [bussCd]
      , function(error, results, fields) {
          if (error) {
              console.log(error);
              throw error;
          }

          data = results;
          console.log(data);
          res.render('site', {data: data});
      });
});

router.get('/siteForm', function(req, res, next) {

  var db = req.con;
  var data = new Object();
  const sql = "SELECT * \n" +
              "  FROM HWHNR.SAS_BUSS";

  db.query(sql
      , function(error, results, fields) {
          if (error) {
              console.log(error);
              throw error;
          }

          data = results;
          data.BUSSCD = req.session.busscd;
          console.log(data);
          res.render('siteForm', {data: data});
      });
});

router.post('/siteForm', function(req, res, next) {
  let param = JSON.parse(JSON.stringify(req.body));

  var db = req.con;
  var data = "";

  const sql = "INSERT INTO HWHNR.SAS_SITE (SITECD, BUSSCD, SITENM, SITENO, SITEADDR, REMARK) \n" +
              "VALUES (?, ?, ?, ?, ?, ?)";

  db.query(sql, [param.siteCd, param.bussCd, param.siteNm, param.siteNo, param.siteAddr, param.remark]
      , function(error, results, fields) {
          if (error) {
              console.log(error);
              throw error;
          }

          data = results;
          // console.log(data);
          res.redirect('/site');
      });
});


// 근무조관리
router.get('/workGroup', function(req, res, next) {

  var data = "";
  var jsonParams = {
    "Data" : {
      "ds_search" : [ {
        "CORP_CD" : "1000",
        "EMP_NO" : "l1711020",
        "DEVICE_DIV" : "MOBILE",
        "BRCH_CD" : "0100",
        "LOC_CD" : "0101",
        "ROOM_TYPE_CD" : "FAM",
        "MEMB_MAST_NO" : "",
        "MEMB_NO" : "211205339",
        "STRT_DATE" : "20201230",
        "END_DATE" : "20201230",
        "RSRV_CLDR_CL_CD" : "01",
        "CONT_NO" : "",
        "CUST_NO" : "0001338153",
        "MEMB_DIV_CD" : "01",
        "RSRV_ROOM_CNT" : "1",
        "RSRV_LOC_CD" : "",
        "CPON_NO" : "",
        "CORP_CUST_YN" : "N",
        "RSRV_RCEPT_DIV_CD" : "4",
        "WAIT_RSRV_YN" : "N",
        "CUST_IDNT_NO" : "",
        "OB_YN" : "N"
      } ]
    },
    "MessageHeader" : {
      "MSG_PRCS_RSLT_CD" : null,
        "MSG_DATA_SUB_RPTT_CNT" : null,
        "MSG_ETC" : null
      },
      "TransactionHeader" : {
        "STN_MSG_TR_TP_CD" : "O",
        "SYSTEM_TYPE" : "HABIS",
        "SCREEN_SHORTEN_NO" : "",
        "SCREEN_ID" : "",
        "PERS_INFO_PROC_RESN" : null,
        "CMP_NO" : "",
        "CORP_CD" : "1000",
        "BRANCH_NO" : "",
        "LOC_CD" : "",
        "WRKR_NO" : "l1711020",
        "PERS_INFO_MASK" : null,
        "MASK_AUTH" : "0",
        "OSDE_TR_CD" : "",
        "OSDE_TR_ORG_CD" : "",
        "OSDE_TR_MSG_CD" : "",
        "OSDE_TR_JOB_CD" : "",
        "OSDE_TR_RUTN_ID" : "",
        "OSDE_TR_PRG_NO" : "",
        "FILLER" : ""
      },
      "SystemHeader" : {
        "STD_TMSG_LEN" : null,
        "TMSG_VER_DV_CD" : "01",
        "ENVR_INFO_DV_CD" : "D",
        "STN_MSG_ENCP_CD" : "0",
        "STN_MSG_COMP_CD" : "0",
        "LANG_CD" : "KO",
        "TMSG_WRTG_DT" : "20201230",
        "TMSG_CRE_SYS_NM" : "HPG10826",
        "STD_TMSG_SEQ_NO" : "1609294706471",
        "STD_TMSG_PRGR_NO" : "00",
        "STN_TMSG_IP" : "172.25.251.114",
        "STN_TMSG_MAC" : "",
        "FRS_RQST_SYS_CD" : "HPG",
        "FRS_RQST_DTM" : "20201230111826466",
        "TRMS_SYS_CD" : "MCI",
        "TRMS_ND_NO" : "",
        "RQST_RSPS_DV_CD" : "S",
        "TRSC_SYNC_DV_CD" : "S",
        "TMSG_RQST_DTM" : "20201230111826466",
        "RECV_SVC_CD" : "HBSREMPRR0113",
        "INTF_ID" : "TFO00HBSREMPRR0113",
        "TMSG_RSPS_DTM" : "20201230111826483",
        "PRCS_RSLT_CD" : "",
        "ERR_OCC_SYS_CD" : "",
        "STN_TMSG_ERR_CD" : "",
        "MCI_NODE_NO" : "",
        "REMT_IP" : "",
        "MCI_SSN_ID" : "",
        "FILLER" : ""
      }
    };
    var url  = "https://ingatedev.hwhnr.co.kr:443/iGate/TFO/json.jdo";   // API 호출 url
    var headers = {
        "Content-type" : "application/json" // JSON header
    };
    var request = require('request');
    var options = {
      url: url,
      method: 'POST',
      json: true,
      body:jsonParams
    };
    
    request(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        // console.log(body) // Print the shortened url.
        var result=JSON.stringify(body);
        console.log(JSON.parse(result).Data);
      }
    });
    res.render('workGroup', {data: data});
});

													  

// 근무자관리
router.get('/worker', function(req, res, next) {

  var db = req.con;
  var data = "";

  const sql = "SELECT @ROWNUM := @ROWNUM + 1 AS ROWNUM, A.*, B.*, C.* \n" +
              "  FROM HWHNR.SAS_WORKER A\n" +
              "     , HWHNR.SAS_BUSS B\n" +
              "     , HWHNR.SAS_SITE C\n" +
              "     , (SELECT @ROWNUM := 0 ) TMP\n"+
              " WHERE A.BUSSCD = B.BUSSCD \n" +
              "   AND A.BUSSCD = C.BUSSCD \n" +
              "   AND A.SITECD = C.SITECD \n" +
              " ORDER BY A.BUSSCD, A.SITECD, A.WORKERCD";
  console.log(sql);
  db.query(sql
      , function(error, results, fields) {
          if (error) {
              console.log(error);
              throw error;
          }

          data = results;
          console.log(data);
          res.render('worker', {data: data});
      });
});

router.get('/workerForm', function(req, res, next) {

  var db = req.con;
  var data = "";
  const sql1 = "SELECT * \n" +
               "  FROM HWHNR.SAS_BUSS A;"
  const sql2 = "SELECT * \n" +
               "  FROM HWHNR.SAS_SITE A\n";
  
  db.query(sql1 + sql2, [req.params.bussCd]
      , function(error, results, fields) {
          if (error) {
              console.log(error);
              throw error;
          }

          data = results;
          bussList = data[0];
          siteList = data[1];
          res.render('workerForm', {bussList: bussList, siteList: siteList});
      });
});

router.post('/workerForm', function(req, res, next) {
  let param = JSON.parse(JSON.stringify(req.body));

  var db = req.con;
  var data = "";
  const sql = "INSERT INTO HWHNR.SAS_WORKER (BUSSCD, SITECD, WORKERCD, NAME, WORKTYP, TELNO, EMAIL, ADDR, BIRTHDAY, STARTYMD) \n" +
              "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  
  db.query(sql, [param.bussCd, param.siteCd, param.workerCd, param.name, param.workTyp, param.telNo, param.email, param.addr, param.birthDay.replace(/-/gi, ""), param.startYmd.replace(/-/gi, "")]
      , function(error, results, fields) {
          if (error) {
              console.log(error);
              throw error;
          }

          data = results;
          res.redirect('/worker');
      });
});

>>>>>>> 0d6b25175cfc09ffabec269ce79dbf873ed98a79
module.exports = router;

function test() {
  return new Promise(resolve => {
    setTimeout(() => 
      resolve(''), 1000);
  })
}