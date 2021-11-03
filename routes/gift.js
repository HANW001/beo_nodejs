const express = require('express')
const fs = require('fs');
const ejs = require('ejs');

const { users } = require('../models');
let router = express.Router();

const mainPage = fs.readFileSync('views/pages/admin.ejs', 'utf8');
const listPage = fs.readFileSync('views/pages/list.ejs', 'utf8');

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

router.get('/test3', (req, res) =>  {
    var id = req.query.id;
    // var id = req.body.id;
    users.findAll({
        attributes: ['id', 'password'],
        where: {id: id}
    })
    .then(result => {
        // res.json({"data":result, test: "test", error: null})
        var page = ejs.render(listPage, {
            title: "Temporary Title",
            data:result
        });
        // console.log(data)
        res.send(page)
        // res.json(result)
    })
    .catch(err => {
        console.error(err);
        res.json({error: null}
    )});
})


module.exports = router;