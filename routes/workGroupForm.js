var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {

    var db = req.con;
    var data = "";
    var bussCd = req.session.busscd;
    console.log(bussCd);


    const sql = "SELECT * \n" +
        "  FROM HWHNR.SAS_SITE A \n" +
        " WHERE A.BUSSCD = ?;"

    db.query(sql, [bussCd]
        , function (error, results, fields) {
            if (error) {
                console.log(error);
                throw error;
            }
            console.log(sql);

            data = results;
            siteList = data;
            res.render('workGroupForm', { siteList: siteList });
        });
});

router.post('/', function (req, res, next) {
    let param = JSON.parse(JSON.stringify(req.body));

    var db = req.con;
    var data = "";
    const bussCd = req.session.busscd;
    const usrId = req.session.usrId;

    const sql1 = "SELECT CONCAT('WT', LPAD(COALESCE(MAX(REPLACE(WORKTYPCD, 'WT', '')), 0) + 1, 8, '0')) WORKTYPCD \n" +
        "FROM SAS_WORK_TYPE \n" +
    "WHERE BUSSCD = ?";

    db.query(sql1, [bussCd]
        , function (error, results, fields) {
            if (error) {
                console.log(error);
                throw error;
            }

            console.log(sql1);
            const workTypCd = results[0].WORKTYPCD;

            const sql2 = "INSERT INTO HWHNR.SAS_WORK_TYPE (BUSSCD, SITECD, WORKTYPCD, WORKTYPNM, TIMEFROM, TIMETO, CREBY, CREDTE, UPDBY, UPDDTE) \n" +
                "VALUES (?, ?, ?, ?, ?, ?, ?, now(), ?, now())";

            db.query(sql2, [bussCd, param.siteCd, workTypCd, param.workTypNm, param.workTime, param.workTime, usrId, usrId]
                , function (error, results, fields) {
                    if (error) {
                        console.log(error);
                        throw error;
                    }

                    data = results;
                    res.redirect('/workGroup');
                });

        });
});

module.exports = router;
