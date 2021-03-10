var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', async function(req, res, next) {
  var data = "";
  var jsonParams = {
    "Data" : {
      "ds_search" : [ {
        "_RowType_" : "U",
        "BRCH_CD" : "0300",
        "BRCH_NM" : "지리산",
        "LOC_CD" : "0301",
        "LOC_NM" : "",
        "SET_MGT_NO" : "1",
        "ROOM_NO" : ""
      } ]
    },
    "TransactionHeader" : {
      "STN_MSG_TR_TP_CD" : "O",
      "SYSTEM_TYPE" : "HABIS",
      "SCREEN_SHORTEN_NO" : "",
      "SCREEN_ID" : "ROMRRA0800M01",
      "PERS_INFO_PROC_RESN" : "",
      "CMP_NO" : "",
      "CORP_CD" : "1000",
      "BRANCH_NO" : "0000",
      "LOC_CD" : "0034",
      "WRKR_NO" : "p5910782",
      "PERS_INFO_MASK" : "",
      "MASK_AUTH" : "1",
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
      "TMSG_WRTG_DT" : "20210222",
      "TMSG_CRE_SYS_NM" : "TFO20601",
      "STD_TMSG_SEQ_NO" : "81613919898144",
      "STD_TMSG_PRGR_NO" : "00",
      "STN_TMSG_IP" : "172.25.2.79",
      "STN_TMSG_MAC" : "f8-0d-ac-f3-5c-d2",
      "FRS_RQST_SYS_CD" : "TFO",
      "FRS_RQST_DTM" : "20210222000458144",
      "TRMS_SYS_CD" : "MCI",
      "TRMS_ND_NO" : "",
      "RQST_RSPS_DV_CD" : "S",
      "TRSC_SYNC_DV_CD" : "S",
      "TMSG_RQST_DTM" : "20210222000458144",
      "RECV_SVC_CD" : "HBSROMRRA0804",
      "INTF_ID" : "TFO00HBSROMRRA0804",
      "TMSG_RSPS_DTM" : "20210222000457334",
      "PRCS_RSLT_CD" : "",
      "ERR_OCC_SYS_CD" : "",
      "STN_TMSG_ERR_CD" : "",
      "MCI_NODE_NO" : "",
      "REMT_IP" : "",
      "MCI_SSN_ID" : "X13q00ua",
      "FILLER" : ""
    },
    "ds_search" : null
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
    
    await request(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        // console.log(body) // Print the shortened url.
        var result=JSON.stringify(body);
        // console.log(JSON.parse(result).Data);
        data = JSON.parse(result).Data.ds_roomStat;
      }
    });
    await test();
    console.log(data);
    console.log(req.session.busscd);
    res.render('clnStatBoard', {data: data});
});

// 객실상태변경
// router.post('/bussForm/:bussCd', function(req, res, next) {
router.post('/', async function(req, res, next) {
  let param = JSON.parse(JSON.stringify(req.body));
  console.log(param.roomNo);
  var data = "";
  var jsonParams = {
    "Data" : {
      "ds_roomStatCd" : [ {
        "_RowType_" : "I",
        "BRCH_CD" : "0300",
        "LOC_CD" : "0301",
        "ROOM_NO" : param.roomNo,
        "ROOM_STAT_CD" : param.roomStatCd
      } ]
    },
    "TransactionHeader" : {
      "STN_MSG_TR_TP_CD" : "O",
      "SYSTEM_TYPE" : "HABIS",
      "SCREEN_SHORTEN_NO" : "",
      "SCREEN_ID" : "ROMRRA0800M01",
      "PERS_INFO_PROC_RESN" : "",
      "CMP_NO" : "",
      "CORP_CD" : "1000",
      "BRANCH_NO" : "0000",
      "LOC_CD" : "0034",
      "WRKR_NO" : "p5910782",
      "PERS_INFO_MASK" : "",
      "MASK_AUTH" : "1",
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
      "TMSG_WRTG_DT" : "20210222",
      "TMSG_CRE_SYS_NM" : "TFO73353",
      "STD_TMSG_SEQ_NO" : "61613961897558",
      "STD_TMSG_PRGR_NO" : "00",
      "STN_TMSG_IP" : "172.25.2.79",
      "STN_TMSG_MAC" : "f8-0d-ac-f3-5c-d2",
      "FRS_RQST_SYS_CD" : "TFO",
      "FRS_RQST_DTM" : "20210222114457558",
      "TRMS_SYS_CD" : "MCI",
      "TRMS_ND_NO" : "",
      "RQST_RSPS_DV_CD" : "S",
      "TRSC_SYNC_DV_CD" : "S",
      "TMSG_RQST_DTM" : "20210222114457558",
      "RECV_SVC_CD" : "HBSROMRRA0802",
      "INTF_ID" : "TFO00HBSROMRRA0802",
      "TMSG_RSPS_DTM" : "20210222114456631",
      "PRCS_RSLT_CD" : "",
      "ERR_OCC_SYS_CD" : "",
      "STN_TMSG_ERR_CD" : "",
      "MCI_NODE_NO" : "",
      "REMT_IP" : "",
      "MCI_SSN_ID" : "X13q00ua",
      "FILLER" : ""
    },
    "ds_roomStatCd" : null
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
    var data = '';
    await request(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        // console.log(body) // Print the shortened url.
        var result=JSON.stringify(body);
        // console.log(JSON.parse(result).Data);
        data = JSON.parse(result).MessageHeader;
      }
    });
    await test();
    console.log(data);
    console.log(req.session.busscd);
    res.redirect('/clnStatBoard');
});

function test() {
  return new Promise(resolve => {
    setTimeout(() => 
      resolve(''), 1500);
  })
}

router.get('/view', async function (req, res, next) {
  var db = req.con;
  var form = "";
  var mngPoint = "";
  var data = "";

  var bussCd = req.query.bussCd;
  // var bussCd = req.session.busscd;
  // var rowIdx = req.body.rowIdx;

  var roomNo = req.query.roomNo;
  var data = "";
  var jsonParams = {
    "Data" : {
      "ds_search" : [ {
        "_RowType_" : "U",
        "BRCH_CD" : "0300",
        "BRCH_NM" : "지리산",
        "LOC_CD" : "0301",
        "LOC_NM" : "",
        "SET_MGT_NO" : "1",
        "ROOM_NO" : roomNo
      } ]
    },
    "TransactionHeader" : {
      "STN_MSG_TR_TP_CD" : "O",
      "SYSTEM_TYPE" : "HABIS",
      "SCREEN_SHORTEN_NO" : "",
      "SCREEN_ID" : "ROMRRA0800M01",
      "PERS_INFO_PROC_RESN" : "",
      "CMP_NO" : "",
      "CORP_CD" : "1000",
      "BRANCH_NO" : "0000",
      "LOC_CD" : "0034",
      "WRKR_NO" : "p5910782",
      "PERS_INFO_MASK" : "",
      "MASK_AUTH" : "1",
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
      "TMSG_WRTG_DT" : "20210222",
      "TMSG_CRE_SYS_NM" : "TFO20601",
      "STD_TMSG_SEQ_NO" : "81613919898144",
      "STD_TMSG_PRGR_NO" : "00",
      "STN_TMSG_IP" : "172.25.2.79",
      "STN_TMSG_MAC" : "f8-0d-ac-f3-5c-d2",
      "FRS_RQST_SYS_CD" : "TFO",
      "FRS_RQST_DTM" : "20210222000458144",
      "TRMS_SYS_CD" : "MCI",
      "TRMS_ND_NO" : "",
      "RQST_RSPS_DV_CD" : "S",
      "TRSC_SYNC_DV_CD" : "S",
      "TMSG_RQST_DTM" : "20210222000458144",
      "RECV_SVC_CD" : "HBSROMRRA0804",
      "INTF_ID" : "TFO00HBSROMRRA0804",
      "TMSG_RSPS_DTM" : "20210222000457334",
      "PRCS_RSLT_CD" : "",
      "ERR_OCC_SYS_CD" : "",
      "STN_TMSG_ERR_CD" : "",
      "MCI_NODE_NO" : "",
      "REMT_IP" : "",
      "MCI_SSN_ID" : "X13q00ua",
      "FILLER" : ""
    },
    "ds_search" : null
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
    
    await request(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        // console.log(body) // Print the shortened url.
        var result=JSON.stringify(body);
        // console.log(JSON.parse(result).Data);
        data = JSON.parse(result).Data.ds_roomStat;
      }
    });
    await test();
    console.log(data);
    // console.log(req.session.busscd);
    console.log("＃＃＃＃＃＃＃＃＃＃＃" + roomNo);
    url = "./form/roomDtl"
    res.render(url, {data: data});
});

// 객실상태변경
// router.post('/bussForm/:bussCd', function(req, res, next) {
  router.post('/submit', async function(req, res, next) {
    let param = JSON.parse(JSON.stringify(req.body));
    console.log(param.roomNo);
    console.log(param.roomNo);
    console.log(param.roomNo);
    console.log(param.roomNo);
    var data = "";
    var jsonParams = {
      "Data" : {
        "ds_roomStatCd" : [ {
          "_RowType_" : "I",
          "BRCH_CD" : "0300",
          "LOC_CD" : "0301",
          "ROOM_NO" : param.roomNo,
          "ROOM_STAT_CD" : "VC"
        } ]
      },
      "TransactionHeader" : {
        "STN_MSG_TR_TP_CD" : "O",
        "SYSTEM_TYPE" : "HABIS",
        "SCREEN_SHORTEN_NO" : "",
        "SCREEN_ID" : "ROMRRA0800M01",
        "PERS_INFO_PROC_RESN" : "",
        "CMP_NO" : "",
        "CORP_CD" : "1000",
        "BRANCH_NO" : "0000",
        "LOC_CD" : "0034",
        "WRKR_NO" : "p5910782",
        "PERS_INFO_MASK" : "",
        "MASK_AUTH" : "1",
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
        "TMSG_WRTG_DT" : "20210222",
        "TMSG_CRE_SYS_NM" : "TFO73353",
        "STD_TMSG_SEQ_NO" : "61613961897558",
        "STD_TMSG_PRGR_NO" : "00",
        "STN_TMSG_IP" : "172.25.2.79",
        "STN_TMSG_MAC" : "f8-0d-ac-f3-5c-d2",
        "FRS_RQST_SYS_CD" : "TFO",
        "FRS_RQST_DTM" : "20210222114457558",
        "TRMS_SYS_CD" : "MCI",
        "TRMS_ND_NO" : "",
        "RQST_RSPS_DV_CD" : "S",
        "TRSC_SYNC_DV_CD" : "S",
        "TMSG_RQST_DTM" : "20210222114457558",
        "RECV_SVC_CD" : "HBSROMRRA0802",
        "INTF_ID" : "TFO00HBSROMRRA0802",
        "TMSG_RSPS_DTM" : "20210222114456631",
        "PRCS_RSLT_CD" : "",
        "ERR_OCC_SYS_CD" : "",
        "STN_TMSG_ERR_CD" : "",
        "MCI_NODE_NO" : "",
        "REMT_IP" : "",
        "MCI_SSN_ID" : "X13q00ua",
        "FILLER" : ""
      },
      "ds_roomStatCd" : null
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
      var data = '';
      await request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          // console.log(body) // Print the shortened url.
          var result=JSON.stringify(body);
          // console.log(JSON.parse(result).Data);
          data = JSON.parse(result).MessageHeader;
        }
      });
      await test();
      console.log(data);
      console.log(req.session.busscd);
      url = "./form/roomDtl"
      res.redirect('/clnStatBoard');
  });

module.exports = router;
