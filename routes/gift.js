const express = require("express");
const fs = require("fs");
const ejs = require("ejs");
const bodyParser = require("body-parser");

const { users } = require("../models");
let router = express.Router();

const mainPage = fs.readFileSync("views/pages/admin.ejs", "utf8");
const listPage = fs.readFileSync("views/pages/list.ejs", "utf8");

const giftPage = fs.readFileSync("views/page/gift2.html", "utf8");

var mysql = require("mysql");
const { resourceLimits } = require("worker_threads");
var connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "root",
  database: "beo",
  multipleStatements: true,
});

router.get("/gift", (req, res) => {
    res.render(giftPage);
  });
// router.get('/test', (req, res) => {
//     connection.query('select * from prices', function(error,results){
//         console.log(results)
//         if (error){
//             console.log(error);
//         } else{
//             res.send(results)
//             console.log(results)
//         }
//         // res.json(results)
//     });
// })

router.post('/product', (req, res) => {

    let ProductID = req.body.ProductID;
    
    connection.query('select * from beo.products as a where a.ProductID =' + [ProductID], function(error,results){
        if (error){
            console.log(error);
        } else{
            res.send(results)
            console.log(results)
        }
        // res.json(results)
    });
})

router.get("/test2", (req, res) => {
  var page = ejs.render(listPage, {
    title: "Temporary Title",
  });
  res.send(page);
});

// router.get('/testtest', (req, res) => {
//     fs.readFile('./views/beobeta/admin/admin.html', 'UTF-8',   function(err, data) {
//         if (err) {
//             console.log(err)
//         }else{
//             res.writeHead(200, {'Content-Type': 'text/html'});
//             res.write(data);
//             res.end();
//         }

//     });

// });

// router.post('/test3', (req, res) =>  {
//     // console.log(req.body)
//     // var id = req.query.id;
//     var id = req.body.id;
//     console.log(id)

//     // 1. 조건1 일치하는 태그수가 많은 상품부터 순서대로 출력합니다.
//     //  -1 4개의 절대 태그(가격대, 관계, 선물상황, 성별) 는 무조건 100% 일치해야 합니다.
//     //  -2 태그는총7개(가격대, 관계, 선물상황, 성별, 관심사, 연령, 계절)입니다.
//     //  -3 계절 태그는 유저가 선물 의뢰한 월, 다음월, 다다음월 3개 월(EX: 유저가 10월 22일에 선물 의뢰했으면, 10월, 11월, 12월 태그가 들어가 있는 상품이 일치한다고 판단)이 태그에 포함되어 있으면 일치한다
//     //  -4 가격태그는 범위로 불러옵니다.

//     // 2. 조건2 1~10위까지 3개의 상품성격(안전한 상품, 도전적인 상품, 개성있는 상품)이 순차적으로 반복해서 출력되게 합니다.
//     //   (1위: 안전한 상품, 2위: 도전적인 상품, 3위: 개성있는 상품, 4위: 안전한 상품, 5위: 도전적인 상품)

//     // 3. 조건3 10개의 상품 중에 선물종류(약 20개 태그)가 겹치면 안 됩니다.
//     //  - 무조건 중복 불가가 아니라 동일 카테고리에서 3개이상 노출되지 않아야 하며 이 3이라는 갯수는 추후에 수정할 수 있어야 합니다. (10개의 제안 상품 중 동일 카테고리 3개까지 노출가능)
//     // 4. 조건4

//     // 5. 조건5

var now = new Date();	// 현재 날짜 및 시간
var month = now.getMonth();

const tmp = 'drop TEMPORARY TABLE if exists tmps;'
const tmp2 = ' CREATE TEMPORARY TABLE tmps'

const sql = ' select A.PriceRange, B.RelationName, C.PurposeName, D.ProductID,D.ProductName,D.Price,D.ProductDesc,D.Reason,D.Gender, E.Nature FROM beo.prices as A , (beo.relations as B INNER JOIN beo.prdtrelation as BP ON B.Relation=BP.Relation)  inner JOIN (beo.purposes as C INNER JOIN beo.prdtpurpose as CP ON C.Purpose=CP.Purpose) ON BP.ProductID=CP.ProductID INNER JOIN beo.products as D on BP.ProductID = D.ProductID and (D.Gender = ? or D.Gender=?)  inner join beo.prdtnature as e on D.ProductID = e.ProductID'
const where = ' WHERE A.PriceRange=? and B.RelationName=?AND  C.PurposeName=? and D.Price between A.FromPrice and A.ToPrice order by E.nature asc,D.Price asc ; '

const tmp3 = ' drop TEMPORARY TABLE if exists tmp2;'
const tmp4 = ' CREATE TEMPORARY TABLE tmp2'
const sqlseason = ' SELECT HP.ProductID FROM (beo.seasons as H INNER JOIN beo.prdtseason as HP ON H.Season=HP.Season )'
const whereseason=' WHERE H.Season=? and HP.ProductID NOT IN (SELECT DISTINCT tmps.productID FROM tmps);'

const tmp5 = ' drop TEMPORARY TABLE if exists tmp3;'
const tmp6 = ' CREATE TEMPORARY TABLE tmp3'
const sqltmp = ' SELECT * FROM tmps where tmps.ProductID  NOT IN (SELECT DISTINCT tmp2.ProductID FROM tmp2 WHERE tmp2.ProductID);'
const select = ' select * from tmp3;'

const tmp7 = ' drop TEMPORARY TABLE if exists tmps2;'
const tmp8 = ' CREATE TEMPORARY TABLE tmps2'
const sqlinter = ' select F.InterestName,tmp3.* from (beo.interest as F INNER JOIN beo.prdtinterest as FP ON F.interest=FP.interest) inner join tmp3 on FP.ProductID = tmp3.ProductID'
const whereinter =" where F.InterestName = ? ;"

const tmp9 = ' drop TEMPORARY TABLE if exists tmps3;'
const tmp10 = ' CREATE TEMPORARY TABLE tmps3'
const sqlage = ' select G.ages,tmp3.* from (beo.ages as G INNER JOIN beo.prdtage as GP ON G.ages=GP.ages) inner join tmp3 on GP.ProductID = tmp3.ProductID'
const whereage =" where G.AgeName = ? ;"

const tmp11 = ' drop TEMPORARY TABLE if exists tmp4;'
const tmp12 = ' CREATE TEMPORARY TABLE tmp4'

const union = ' union all'
const utmps = ' select productID,Nature from tmps'
const utmps2 = ' select productID,Nature from tmps2'
const utmp3 = ' select productID,Nature from tmp3'
const utmps3 = ' select productID,Nature from tmps3'
const end = ';'
const cnt = ' select *, count(*) as cnt from products as A, tmp4 as B where A.productID = B.productID group by A.productID having cnt >= 1 order by cnt desc;'

router.post('/test3', (req, res) => {
    let Gender = req.body.Gender;
    let Gender2 = 2;
    let PriceRange = req.body.PriceRange;
    let RelationName = req.body.RelationName;
    let PurposeName = req.body.PurposeName;
    let InterestName = req.body.InterestName;
    let AgeName = req.body.AgeName;
    
    if (Gender=='남성') {
        Gender='0'
    }else if(Gender=='여성'){
        Gender='1'
    }else{Gender='2'}

    if (InterestName !='' && AgeName=='') {
        connection.query(tmp+tmp2+sql+where+tmp3+tmp4+sqlseason+whereseason+tmp5+tmp6+sqltmp+tmp7+tmp8+sqlinter+whereinter+tmp11+tmp12+utmps+union+utmps2+union+utmp3+end+cnt,[Gender,Gender2 ,PriceRange,RelationName,PurposeName,month,InterestName], function(error,results){
            console.log(results)
            if (error){
                console.log(error);
            } else{
                var page = ejs.render(listPage, {
                    title: "Temporary Title",
                    data: results[results.length-1]
                });
                res.send(page)
            }
            // res.json(results)
        });
    }else if (InterestName !='' && AgeName!='') {
        connection.query(tmp+tmp2+sql+where+tmp3+tmp4+sqlseason+whereseason+tmp5+tmp6+sqltmp+tmp7+tmp8+sqlinter+whereinter+tmp9+tmp10+sqlage+whereage+tmp11+tmp12+utmps+union+utmps2+union+utmp3+union+utmps3+end+cnt,[Gender,Gender2 ,PriceRange,RelationName,PurposeName,month,InterestName,AgeName], function(error,results){
            console.log(results)
            if (error){
                console.log(error);
            } else{
                var page = ejs.render(listPage, {
                    title: "Temporary Title",
                    data: results[results.length-1]
                });
                res.send(page)
            }
            // res.json(results)
        });
    } else if (InterestName =='' && AgeName!='') {
        connection.query(tmp+tmp2+sql+where+tmp3+tmp4+sqlseason+whereseason+tmp5+tmp6+sqltmp+tmp9+tmp10+sqlage+whereage+tmp11+tmp12+utmps+union+utmps3+union+utmp3+end+cnt,[Gender,Gender2 ,PriceRange,RelationName,PurposeName,month,AgeName], function(error,results){
            console.log(results)
            if (error){
                console.log(error);
            } else{
                var page = ejs.render(listPage, {
                    title: "Temporary Title",
                    data: results[results.length-1]
                });
                res.send(page)
            }
            // res.json(results)
        });
    } else if( InterestName =='' && AgeName ==''){
        connection.query(tmp+tmp2+sql+where+tmp3+tmp4+sqlseason+whereseason+tmp5+tmp6+sqltmp+select,[Gender,Gender2 ,PriceRange,RelationName,PurposeName,month], function(error,results){
            console.log(results)
            if (error){
                console.log(error);
            } else{
                var page = ejs.render(listPage, {
                    title: "Temporary Title",
                    data: results[results.length-1]
                });
                res.send(page)
            }
            // res.json(results)
        });
    }
})

module.exports = router;
