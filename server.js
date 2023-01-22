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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

  app.put('/contacts', async function (req, res) {
    const contacts = await client.db('contacts').collection('contacts');

    //set operator needed for updateOne function
    const contact = req.body;
    const contactSet = { $set: req.body };

    if(/*validateContact(contact)*/true) {
      if(req.query.id) {
        const id = req.query.id;
        const queryById = 
        {
            _id: ObjectId(id)
        };

        try {
          contacts.updateOne(queryById, contactSet);
          res.status(200).send("Contact successfully updated.");
        }
        catch (e) {
          res.send("Error updating contact: " + e);
        }
      }
  
      else {
        res.status(400).send("id query parameter required for PUT");
      }
    }

    else {
      res.status(400).send("Contact is not formatted correctly.");
    }
    
  })

  app.post('/contacts', async function (req, res) {
    //get contacts collection
    const contacts = await client.db('contacts').collection('contacts');

    const contact = req.body;
    if (validateContact(contact)) {
      try {
        contacts.insertOne(contact);
        res.status(201).json(contact._id);
      }
      catch (e) {
        res.send("Error inserting contact: " + e);
      }
    }

    else {
      res.status(400).send("Contact is not formatted correctly.");
    }
  });

  app.delete('/contacts', async function (req, res) {
    //get contacts collection
    const contacts = await client.db('contacts').collection('contacts');

    if(req.query.id) {
      const id = req.query.id;
      const queryById = 
      {
        _id: ObjectId(id)
      };
      try {
        contacts.deleteOne(queryById);
        res.send("Contact successfully deleted");
      }
      catch(e) {
        res.send("Error deleting contact: " + e);
      }
    }

    else {
      res.status(400).send("id query parameter required for PUT");
    }
  });

  app.listen(port, () => console.log('Started Server listening on port ' + port));
}

function validateContact(contact) {
  if (typeof contact !== 'undefined' &&
    typeof contact.firstName !== 'undefined' &&
    typeof contact.lastName !== 'undefined' &&
    typeof contact.email !== 'undefined' &&
    typeof contact.favoriteColor !== 'undefined' &&
    typeof contact.birthday !== 'undefined') {
    return true;
  }
  else {
    return false;
  }
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
