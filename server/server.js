const express = require('express');
const path = require('path');
const app = express();
const fs = require('fs');
const bodyParser = require('body-parser');
const CryptoJS = require('crypto-js');
const { send } = require('process');

app.use((req, res, next) => {
    console.log(req.url);
    next();
});

app.use(bodyParser.urlencoded({extended: false}));


app.post('/sign-up', (req, res) => {
    /***************************8
     * there are no verification checks.
     * same usernames and emails can be used,
     * also didn't check if passwords match.
     * but salting and hashing works.
     */
    let dataPath = path.join(__dirname, '../users.json');
    fs.readFile(dataPath, 'utf8', function (err, data) {
        try {
            let salt = CryptoJS.lib.WordArray.random(21/6).toString();
            console.log(req.body.firstname);
            data = (JSON.parse(data));
            data.user.push({
                id: data.user[data.user.length-1].id+1,
                username: req.body.username,
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                passhash: CryptoJS.MD5(req.body.password1 + salt).toString(),
                salt: salt
            });
            console.log(data);
            fs.writeFileSync(dataPath, JSON.stringify(data));
            res.send("You did it!");
        } catch (e) {
            res.send(e);
            console.log(e);
        }
    }); 
});

app.get('/accounts', function(req, res){
    res.sendFile(path.join(__dirname, '../users.json'));
  }); 


app.use(express.static(path.join(__dirname, '../public')));


app.listen(3001);
console.log(`Port 3001`)