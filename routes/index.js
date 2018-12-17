var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())




router.get('/', function (req, res) {
    res.sendFile('login');
});


router.post('/route', function (req, res) {
    var data = JSON.stringify(req.body);
    data = JSON.parse(data);
    if (data.password != data.confirm) {
        res.send("passwords not equal");
    }
    else {
        res.send("passwords equal :D ");


    }
});





module.exports = router;
