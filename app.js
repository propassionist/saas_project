var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var bussRouter = require('./routes/buss');
var bussFormRouter = require('./routes/bussForm');
var siteRouter = require('./routes/site');
var siteFormRouter = require('./routes/siteForm');
var workGroupRouter = require('./routes/workGroup');
var workGroupFormRouter = require('./routes/workGroupForm');
var workerRouter = require('./routes/worker');
var workerFormRouter = require('./routes/workerForm');
var workPlanRouter = require('./routes/workPlan');
var workModifyRouter = require('./routes/workModify');
var workRequestRouter = require('./routes/workRequest');
var workReqCmfRouter = require('./routes/workReqCmf');

var workRouter = require('./routes/work');
var workFormRouter = require('./routes/workForm');

var reportRouter = require('./routes/report');
var reportFormRouter = require('./routes/reportForm');

var mngPointRouter = require('./routes/mngPoint');
var mngPointFormRouter = require('./routes/mngPointForm');

// DataBase
var mysql      = require('mysql');
// var con = mysql.createConnection({
//   host     : 'db-5l7rn-kr.vpc-pub-cdb.ntruss.com',
//   user     : 'propassionist',
//   password : 'hwhnr123!@#',
//   database : 'HWHNR',
//   connectionLimit: 50,
//   queueLimit: 0,
//   waitForConnection: true
// });

// con.connect(function(err) {
//   if (err) {
//       console.log('connecting error');
//       return;
//   }
//   console.log('connecting success');
// });

var pool  = mysql.createPool({
  host            : 'db-5l7rn-kr.vpc-pub-cdb.ntruss.com',
  user            : 'propassionist',
  password        : 'hwhnr123!@#',
  database        : 'HWHNR',
  connectionLimit : 50,
  queueLimit: 0
});
 
/*var mssql = require("mssql");

var con = new mssql.ConnectionPool({
    user: 'dsp',
    password: 'est@te153',
    server: '10.27.8.23',
    database: 'dspdta',
    connectionTimeout: 300000,
    requestTimeout: 300000,
    pool: {
        idleTimeoutMillis: 300000,
        max: 100
    }
})

con.connect(function(err) {
    if (err) {
        console.log('connecting error');
        return;
    }
    console.log('connecting success');
});*/

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  // cookie: { secure: true }
}))

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// db state
app.use(function(req, res, next) {
  // req.con = con;
  req.con = pool;
  next();
});

// app.use(function(req, res, next) {
//   console.log('test');
//   // if path does not start with /error/, then invoke session middleware
//   console.log(req.url);
//   console.log('dfdf : ' + req.session.usrId);
//   if (req.url !== "/" && req.url.indexOf("/login") !== 0 && req.url.indexOf("/?") !== 0) {
//     if(req.session.usrId == undefined){
//       console.log('wegwgweg');      
//       req.session.msg = '세션이 만료되었습니다. 다시 로그인 해주십시오.';
//       res.redirect('/');
//     }else{
//       next();
//     }
//   } else {
//       next();
//   }
// });

// 로그인
app.use('/users', usersRouter);

// 회사관리
app.use('/buss', bussRouter);
app.use('/bussForm', bussFormRouter);

// 사업장관리
app.use('/site', siteRouter);
app.use('/siteForm', siteFormRouter);

// 근무조관리
app.use('/workGroup', workGroupRouter);
app.use('/workGroupForm', workGroupFormRouter);

// 근무자관리
app.use('/worker', workerRouter);
app.use('/workerForm', workerFormRouter);

// 근무스케줄관리
app.use('/workPlan', workPlanRouter);

// R/M관리
app.use('/workModify', workModifyRouter);

app.use('/workReqCmf', workReqCmfRouter);

app.use('/workRequest', workRequestRouter);

app.use('/report', reportRouter);
app.use('/reportForm', reportFormRouter);

app.use('/mngPoint', mngPointRouter);
app.use('/mngPointForm', mngPointFormRouter);

app.use('/work', workRouter);
app.use('/workForm', workFormRouter);

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
