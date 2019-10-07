# Faucet-XEM
XEM-faucet Testnet
# XEM-Faucet
### Made for Blockchain Course
The purpose of this project is to show the workflow of a faucet focused on NEM and the usability of they SDK to build these kind of projects.  

![](files/Screen Shot 2019-10-06 at 6.29.38 PM)

## Prerequisites
* NEM Wallet (The one who will supply XEM)
* NodeJS
* npm


## Installing
First clone or download this repository and execute these commands inside project's folder: 

1. To install nodejs dependencies
```
npm install
```
Will install:
  * express
  * nem-sdk
  * cors

2. In the main.js file write the Private Key of your Wallet to allow the transactions from this account
```javascript
let common = nem.model.objects.create('common')('','--YOUR PRIVATE KEY HERE--');
```
  And in the same file, change the port number to the one desirable for you:
```javascript
let port = //--YOUR PORT HERE-- 
```
  

## Deployment
To run the nodejs server run this command:

```
node main.js
```
And will print you this in the console:
 ```
 Server started! At http://localhost:--YOUR PORT--
 ```
And it's ready for you to open the **index.html** in your browser and start sending XEM :squirrel:
