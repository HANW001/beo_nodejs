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

const sql = ' SELECT A.FromPrice,A.ToPrice, B.Relation, C.Purpose FROM beo.prices as A, beo.relations as B, beo.purposes as C'
const where = ' where A.PriceRange=? and B.RelationName=? and C.PurposeName=?'

router.post('/test3', (req, res) => {
    let PriceRange = req.body.PriceRange;
    let RelationName = req.body.RelationName;
    let PurposeName = req.body.PurposeName;
    // let RelationName = req.body.RelationName;
    connection.query(sql+where,[PriceRange,RelationName,PurposeName], function(error,results){
        // connection.query(sql, function(error,results){
        if (error){
            console.log(error);
        }
        // var page = ejs.render(listPage, {
        //     title: "Temporary Title",
        //     data: results
        // });
        // console.log(data)
        // res.send(page)
        res.json(results)
    });
})




module.exports = router;