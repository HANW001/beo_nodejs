const express = require('express')
const fs = require('fs');
const ejs = require('ejs');
const bodyParser = require('body-parser')

const { users } = require('../models');
let router = express.Router();

const mainPage = fs.readFileSync('views/pages/admin.ejs', 'utf8');
const listPage = fs.readFileSync('views/pages/list.ejs', 'utf8');

var mysql = require('mysql');
var connection = mysql.createConnection({
    host:'127.0.0.1',
    user: 'root',
    password:'root',
    database: 'beo',
    multipleStatements: true
});

router.get('/test', (req, res) => {
    users.findAll({
        attributes: [ 'id', 'password']
    })
    .then(result => {
        // res.json({"data":result, test: "test", error: null})
        var page = ejs.render(mainPage, {
            title: "Temporary Title",
            data:result
        });
        res.send(page)
        // res.json(result)
    })
    .catch(err => {
        console.error(err);
        res.json({error: null}
    )});
})

router.get('/test2', (req, res) => {
    var page = ejs.render(listPage, {
        title: "Temporary Title",
    });
    res.send(page);
});

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

//     users.findAll({
//         attributes: ['id', 'password'],
//         where: {id: id}
//     })
//     .then(result => {
//         // res.json({"data":result, test: "test", error: null})
//         var page = ejs.render(listPage, {
//             title: "Temporary Title",
//             data:result
//         });
//         // console.log(data)
//         res.send(page)
//         // res.json(result)
//     })
//     .catch(err => {
//         console.error(err);
//         res.json({error: null}
//     )});
// })

// const sql = 'SELECT B.Relation FROM beo.relations as B'
// const sql2 = 'SELECT  C.Purpose FROM  beo.purposes as C'
// const where = ' where B.RelationName=?'
// const where2 = ' where C.PurposeName=?'
//D.ProductID,D.ProductName,D.Price,D.ProductDesc,D.Reason,D.Gender, E.Nature

const tmp = 'drop TEMPORARY TABLE if exists tmp;'
const tmp2 = ' CREATE TEMPORARY TABLE tmp'
const sql = ' select A.PriceRange, B.RelationName, C.PurposeName, D.ProductID,D.ProductName,D.Price,D.ProductDesc,D.Reason,D.Gender, E.Nature FROM beo.prices as A , (beo.relations as B INNER JOIN beo.prdtrelation as BP ON B.Relation=BP.Relation)  inner JOIN (beo.purposes as C INNER JOIN beo.prdtpurpose as CP ON C.Purpose=CP.Purpose) ON BP.ProductID=CP.ProductID INNER JOIN beo.products as D on BP.ProductID = D.ProductID and D.Gender = ?  inner join beo.prdtnature as e on D.ProductID = e.ProductID'
const where = ' WHERE A.PriceRange=? and B.RelationName=?AND  C.PurposeName=? and D.Price between A.FromPrice and A.ToPrice order by E.nature; '
const sqlinter = ' select F.InterestName,tmp.* from (beo.interest as F INNER JOIN beo.prdtinterest as FP ON F.interest=FP.interest) inner join tmp on FP.ProductID = tmp.ProductID'
const whereinter =' where F.InterestName = ?;'
const sqlall = 'select F.InterestName,G.ages,tmp.* from (beo.interest as F INNER JOIN beo.prdtinterest as FP ON F.interest=FP.interest) inner join (beo.ages as G INNER JOIN beo.prdtage as GP ON G.ages=GP.ages) on FP.ProductID = GP.ProductID inner join  tmp on FP.ProductID = tmp.ProductID'
const whereall =' where F.InterestName = ? and G.AgeName=?;'
const sqlage = ' select G.ages,tmp.* from (beo.ages as G INNER JOIN beo.prdtage as GP ON G.ages=GP.ages) inner join tmp on GP.ProductID = tmp.ProductID'
const whereage =' where G.AgeName = ?;'
router.post('/test3', (req, res) => {
    let Gender = req.body.Gender=='남자'? '1':'2';
    let PriceRange = req.body.PriceRange;
    let RelationName = req.body.RelationName;
    let PurposeName = req.body.PurposeName;
    let InterestName = req.body.InterestName;
    let AgeName = req.body.AgeName;
    if (InterestName !='' && AgeName=='') {
        connection.query(tmp+tmp2+sql+where+sqlinter+whereinter,[Gender ,PriceRange,RelationName,PurposeName,InterestName], function(error,results){
            console.log(results[results.length-1])
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
        connection.query(tmp+tmp2+sql+where+sqlall+whereall,[Gender ,PriceRange,RelationName,PurposeName,InterestName,AgeName], function(error,results){
            console.log(results[results.length-1])
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
        connection.query(tmp+tmp2+sql+where+sqlage+whereage,[Gender ,PriceRange,RelationName,PurposeName,AgeName], function(error,results){
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
        connection.query(sql+where,[Gender ,PriceRange,RelationName,PurposeName], function(error,results){
            console.log(results)
            if (error){
                console.log(error);
            } else{
                var page = ejs.render(listPage, {
                    title: "Temporary Title",
                    data: results
                });
                
                res.send(page)
            }
           
            // res.json(results)
        });
    }

    
    
})




module.exports = router;