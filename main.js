const express = require('express');
const nem = require("nem-sdk").default;
const cors = require('cors');
const app = express()

let endpoint = nem.model.objects.create("endpoint")(nem.model.nodes.defaultTestnet, nem.model.nodes.defaultPort);


let common = nem.model.objects.create('common')('','63a7391601ac5ff5867037848a9389dde6be384a9fe472170e3d1b0978a3d61b');

app.use(cors());

//--- example of how the a request is recieved ---
// http://localhost:8080/send?account=TAD5ZRSEODGDOW2VTD3RTILRSUX6SKYVKNWM7G34&amount=1&message=sdwfferfwerf

app.get('/send', async function (req, res) {
    var account = req.query.account;
    var amount = req.query.amount;
    var message = req.query.message;

    console.log(account, amount, message);

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