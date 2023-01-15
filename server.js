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

require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 8080;

const {MongoClient} = require('mongodb');

init();

async function init() {
    //connect to MongoDB
    const client = await databaseConnect();

    const databases = await client.db().admin().listDatabases();
    console.log(databases);

    app.listen(port, () => console.log('Started Server listening on port ' + port));
}


async function databaseConnect() {
    const client = new MongoClient(process.env.CONNECTION, { useNewUrlParser: true, useUnifiedtopology: true});

    try {
        await client.connect();
        return client;
    }

    catch (e) {
        console.error(e);
        client.close();
    }
}