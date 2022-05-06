/* Includes community packages.*/
const express = require('express');
const MongoClient = require('mongodb').MongoClient;
/* Initiate app.*/
const app = express();
/* Add request body parser.*/
app.use(express.json());
/* Initiate MongoDB connection.*/
const mongo_db_client = new MongoClient("mongodb://mongo-db:27017",{useUnifiedTopology:true});
/* Health check.*/
app.get('/health',function (req,res) {
  res.send('Healthy.');
});
/* Create account.*/
app.get('/account/create',async function (req,res) {
  try {
    result = await mongo_db_client.db('crm').collection('accounts').insertOne({id:req.query.id,name:req.query.name});
    message = 'Account successfully created.';
    console.log(message);
    res.json({status:'success',message:message});
  } catch(error) {
    console.log(error);
    res.json({status:'failure',message:'Internal server error.'});
  }
});
/* Update account.*/
app.get('/account/update',async function (req,res) {
  try {
    result = await mongo_db_client.db('crm').collection('accounts').updateOne({id:req.query.id},{$set:{name:req.query.name}});
    message = 'Account successfully updated.';
    console.log(message);
    res.json({status:'success',message:message});
  } catch(error) {
    console.log(error);
    res.json({status:'failure',message:'Internal server error.'});
  }
});
/* Delete account.*/
app.get('/account/delete',async function (req,res) {
  try {
    result = await mongo_db_client.db('crm').collection('accounts').deleteOne({id:req.query.id});
    message = 'Account successfully deleted.';
    console.log(message);
    res.json({status:'success',message:message});
  } catch(error) {
    console.log(error);
    res.json({status:'failure',message:'Internal server error.'});
  }
});
/* Dashboard.*/
app.get('/dashboard',async function (req,res) {
  try {
    accounts = await mongo_db_client.db('crm').collection('accounts').find().toArray();
    console.log('Fetched all account records.');
    res.json({status:'success',result:accounts});
  } catch(error) {
    console.log(error);
    res.json({status:'failure',message:'Internal server error.'});
  }
});
/* Main controller.*/
async function main() {
  try {
    await mongo_db_client.connect()
    console.log('Connected the client to the server.');
    await mongo_db_client.db('admin').command({ ping: 1 });
    console.log('Establish and verified connection.');
    app.listen(80,'0.0.0.0');
    console.log('Started HTTP listener.');
  } catch(error) {
    console.log(error);
  }
}
/* Initiation.*/
main();