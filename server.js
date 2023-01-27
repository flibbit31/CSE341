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

//set up dotenv and express
require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//make this work with Brother Birch's frontend
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Z-Key'
  );
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();    
});

//set up mongodb
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

//set up swagger-ui-express
const swaggerUi = require('swagger-ui-express');
const swaggerDoc = require('./swagger.json');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

init();

async function init() {
  const client = await databaseConnect();

  app.get('/contacts/', async function (req, res) {
    console.log("Correct");
    //retrieve first 100 contacts
    const contacts = await client.db('contacts').collection('contacts');
    
    try {
      const result = await contacts.find({}).limit(100).toArray();
      console.log(result);
      res.status(200).json(result);
    }
    catch(e) {
      res.status(400).send('Error getting contacts: ' + e);
    }
    
  });

  app.get('/contacts/:id', async function (req, res) {
    //get contacts collection
    const contacts = await client.db('contacts').collection('contacts');

    //retrieve particular document with this id
    if (req.params.id) {
      console.log('id sent.');
      const id = req.params.id;

      const foundDoc = await contacts
        .find({
          _id: ObjectId(id)
        })
        .toArray();

      console.log(foundDoc);
      res.status(200).json(foundDoc);
    }
  });

  app.put('/contacts/:id', async function (req, res) {
    /* #swagger.parameters['update-info'] = {
      in: 'body',
      schema: {
        $firstName: 'John',
        $lastName: 'Doe',
        $email: 'jdoe@email.com',
        $favoriteColor: 'purple',
        $birthday: '1970-01-01'
      }
    }
    */

    const contacts = await client.db('contacts').collection('contacts');

    //set operator needed for updateOne function
    const contact = req.body;
    const contactSet = { $set: req.body };

    if(req.params.id) {
      const id = req.params.id;
      const queryById = 
      {
        _id: ObjectId(id)
      };

      try {
        contacts.updateOne(queryById, contactSet);
        res.status(200).send("Contact successfully updated.");
      }
      catch (e) {
        res.status(400).send("Error updating contact: " + e);
      }
    }
  
    else {
      res.status(400).send("id query parameter required for PUT");
    }
    
  });

  app.post('/contacts', async function (req, res) {
    /* #swagger.parameters['add-info'] = {
      in: 'body',
      schema: {
        $firstName: 'John',
        $lastName: 'Doe',
        $email: 'jdoe@email.com',
        $favoriteColor: 'purple',
        $birthday: '1970-01-01'
      }
    }
    */
    //get contacts collection
    const contacts = await client.db('contacts').collection('contacts');

    const contact = req.body;
    if (validateContact(contact)) {
      try {
        contacts.insertOne(contact);
        res.status(201).json(contact._id);
      }
      catch (e) {
        res.status(400).send("Error inserting contact: " + e);
      }
    }

    else {
      res.status(400).send("Contact is not formatted correctly.");
    }
  });

  app.delete('/contacts/:id', async function (req, res) {
    //get contacts collection
    const contacts = await client.db('contacts').collection('contacts');

    if(req.params.id) {
      const id = req.params.id;
      const queryById = 
      {
        _id: ObjectId(id)
      };
      try {
        contacts.deleteOne(queryById);
        res.status(200).send("Contact successfully deleted");
      }
      catch(e) {
        res.status(400).send("Error deleting contact: " + e);
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
