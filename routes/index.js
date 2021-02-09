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

module.exports = router;
