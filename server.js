//roughly followed tutorial from here: https://www.digitalocean.com/community/tutorials/how-to-create-a-web-server-in-node-js-with-the-http-module

/*const http = require("http");

const requestListener = function (req, res) {
    res.writeHead(200);
    res.end("Miller H.");
}

const server = http.createServer(requestListener);
server.listen(8080, "0.0.0.0", () => {
    console.log("Running my first server on port 8080");
}); */

//got help from this tutorial: https://www.mongodb.com/languages/express-mongodb-rest-api-tutorial
//and this tutorial: https://www.mongodb.com/developer/languages/javascript/node-crud-tutorial/?_ga=2.265779529.7132876.1673902074-291492033.1672917402

require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 8080;

const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

init();

async function init() {
  const client = await databaseConnect();

  app.get('/contacts', async function (req, res) {
    //get contacts collection
    const contacts = await client.db('contacts').collection('contacts');

    //retrieve particular document with this id
    if (req.query.id) {
      console.log('id sent.');
      const id = req.query.id;

      const foundDoc = await contacts
        .find({
          _id: ObjectId(id)
        })
        .toArray();

      console.log(foundDoc);
      res.json(foundDoc);
    }

    //retrieve first 100 documents
    else {
      //get first 100 contacts

      contacts
        .find({})
        .limit(100)
        .toArray(function (error, result) {
          if (error) {
            res.status(400).send('Error getting contacts');
          } else {
            res.json(result);
          }
        });
    }
  });

  app.listen(port, () => console.log('Started Server listening on port ' + port));
}

async function databaseConnect() {
  const client = new MongoClient(process.env.CONNECTION, {
    useNewUrlParser: true,
    useUnifiedtopology: true
  });

  try {
    await client.connect();
    return client;
  } catch (e) {
    console.error(e);
    client.close();
  }
}
