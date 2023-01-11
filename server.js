//roughly followed tutorial from here: https://www.digitalocean.com/community/tutorials/how-to-create-a-web-server-in-node-js-with-the-http-module

const http = require("http");

const requestListener = function (req, res) {
    res.writeHead(200);
    res.end("Miller H.");
}

const server = http.createServer(requestListener);
server.listen(8080, "0.0.0.0", () => {
    console.log("Running my first server on port 8080");
});