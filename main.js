const express = require('express');
const nem = require("nem-sdk").default;
const cors = require('cors');
const fs = require('fs')
const app = express()

let endpoint = nem.model.objects.create("endpoint")(nem.model.nodes.defaultTestnet, nem.model.nodes.defaultPort);


let common = nem.model.objects.create('common')('','---YOUR PRIVATE KEY HERE----');

app.use(cors());

//--- example of how the a request is recieved ---
// http://localhost:8080/send?account=TAD5ZRSEODGDOW2VTD3RTILRSUX6SKYVKNWM7G34&amount=1&message=sdwfferfwerf

app.get('/send', async function (req, res) {
    var account = req.query.account;
    var amount = req.query.amount;
    var message = req.query.message;
    var db;

    try {
        var jsonString = fs.readFileSync('./accounts.json');
        db = JSON.parse(jsonString);
        //console.log(db);
    } catch(err) {
        console.log(err)
        return
    }
    // check if account in db (JSON)
    var is = false;
    for(var i in db){
        if(i === account){
            is = true;
            break;
        }
    }

    // if exist checks the last time it request XEM (mininum 5 minutes to request again)
    if(is == true){
        var lastTime = db[`${account}`];
        //console.log('---lastTime: ',lastTime)
        var timeNow = Date.now();
        //console.log('---timeNow: ',timeNow)
        var diff = timeNow-lastTime;
        //console.log('---diff: ',diff)

        if(diff < 300000 ){ //246584
            // wait diff / 60000
            console.log(JSON.parse('{"code" : -1, "message": "Stop making traffic here, try later" }'));
            try{
                res.send(JSON.parse( '{"code" : -1, "message": "Stop making traffic here, try later" }' ));
            }catch(err){
                console.log(err);
                res.send(err);
            }
            return ;
             
        }else{
            db[`${account}`] = Date.now();
            const jsonString = JSON.stringify(db, null, 2);
            fs.writeFile('./accounts.json', jsonString, err => {
                if (err) {
                    console.log('Error writing file', err);
                } else {
                    //console.log('Successfully wrote file with new TimeStamp');
                    //console.log(jsonString);
                }
            })
        }
    // if the account doesnt exist, create new entry
    }else{
        db[`${account}`] = Date.now();
        const jsonString = JSON.stringify(db, null, 2);
        fs.writeFile('./accounts.json', jsonString, err => {
            if (err) {
                console.log('Error writing file', err);
            } else {
                //console.log('Successfully wrote file with new account');
                //console.log(jsonString);
            }
        })
    }

    //console.log(account, amount, message);

    let transferTransaction = nem.model.objects.create('transferTransaction')(`${account}`, amount, `${message}`);
    let prepareTransaction = nem.model.transactions.prepare('transferTransaction')(common, transferTransaction, nem.model.network.data.testnet.id);


    var timeStamp = await nem.com.requests.chain.time(endpoint);

    const ts = Math.floor(timeStamp.receiveTimeStamp / 1000);
    prepareTransaction.timeStamp = ts;
    const due = 60;
    prepareTransaction.deadline = ts + due * 60;

    console.log('----PrepareTransac:----- ', prepareTransaction);
    var response;
    try{
        var response = await nem.model.transactions.send(common, prepareTransaction, endpoint);
        console.log('-----Transaction: ----', response);
        res.send(response)
    }catch(err){
        res.send(err)
    }
   
})


app.get('/form', (req, res) => {
    const name = req.query.name; 
    console.log(`hello ${name}`);
    res.send(`hello ${name}`);
});
let port = 8080// --YOUR PORT ---
app.listen(port)
console.log('Server started! At http://localhost:' + port);

/*
// height - lastBlock - 
nem.com.requests.chain.height(endpoint).then(function(res){
    console.log(res);
}, function(err){
    console.log(err)
})
*/