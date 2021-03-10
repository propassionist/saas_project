var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {

    var db = req.con;
    var data = "";
    var bussCd = req.session.busscd;
    var usrId = req.session.usrId;

    const sql1 = "SELECT * \n" +
        "  FROM HWHNR.SAS_BUSS A \n" +
        " WHERE A.BUSSCD = ?;"
    const sql2 = "SELECT * \n" +
        "  FROM HWHNR.SAS_SITE A\n" +
        " WHERE A.BUSSCD = ?;";
    const sql3 = "SELECT * \n" +
        "  FROM HWHNR.SAS_USER A\n" +
        " WHERE A.BUSSCD = ?;";

    db.query(sql1 + sql2 + sql3, [bussCd, bussCd, bussCd]
        , function (error, results, fields) {
            if (error) {
                console.log(error);
                throw error;
            }
            console.log(sql1);
            console.log(sql2);
            console.log(sql3);

            data = results;
            bussList = data[0];
            siteList = data[1];
            userList = data[2];
            res.render('workerForm', { bussList: bussList, siteList: siteList, userList: userList });
        });
});

router.post('/', function (req, res, next) {
    let param = JSON.parse(JSON.stringify(req.body));

    var db = req.con;
    var data = "";
    var bussCd = req.session.busscd;

    const sql1 = "SELECT CONCAT('WK', LPAD(COALESCE(MAX(REPLACE(WORKERCD, 'WK', '')), 0) + 1, 8, '0')) WORKERCD \n" +
                 "FROM SAS_WORKER \n" + 
                 "WHERE BUSSCD = ?";

    var query = db.query(sql1, [bussCd]
        , function (error, results, fields) {
            if (error) {
                console.log(error);
                throw error;
            }

            console.log(query.sql);
            const workerCd = results[0].WORKERCD;

            const sql2 = "INSERT INTO HWHNR.SAS_WORKER (BUSSCD, SITECD, USRID, WORKERCD, NAME, WORKTYP, TELNO, EMAIL, ADDR, BIRTHDAY, STARTYMD) \n" +
                        "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

            query = db.query(sql2, [bussCd, param.siteCd, param.userId, workerCd, param.userNm, param.workTyp, param.telNo, param.email, param.addr, param.birthDay.replace(/-/gi, ""), param.startYmd.replace(/-/gi, "")]
                , function (error, results, fields) {
                    if (error) {
                        console.log(error);
                        throw error;
                    }

                    data = results;
                    res.redirect('/worker');
                });
        });
});
module.exports = router;
