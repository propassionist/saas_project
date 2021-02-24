var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {

  var db = req.con;
  var bussCd = req.session.busscd;
  var siteCd = req.query.site;

  var site = new Object();
  var data = new Object();
  var data2 = new Object();
  var data3 = new Object();
  // bussCd = 'B000000001';

  var query = db.query("SELECT * FROM SAS_SITE WHERE BUSSCD = ?"
    // , [req.session.busscd], function (error, results, fields) {
    , [bussCd], function (error, results, fields) {
      if (error) {
        console.log(error);
        throw error;
      }

      console.log(query.sql);
      console.log(results);

      site = results;

      query = db.query("SELECT * FROM SAS_SCHEDULE WHERE BUSSCD = ? AND SITECD = ?"
        // , [req.session.busscd], function (error, results, fields) {
        , [bussCd, siteCd], function (error, results, fields) {
          if (error) {
            console.log(error);
            throw error;
          }

          console.log(query.sql);
          console.log(results);

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

                  res.render('workPlan', { siteCd: siteCd, site:site, data: data, data2: data2, data3: data3 });

                });

            });

        });
    });

});

module.exports = router;
