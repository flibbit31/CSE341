const http = require("http");

const requestListener = function (req, res) {
    res.writeHead(200);
    res.end("Miller H.");
}

const server = http.createServer(requestListener);
server.listen(8080, "localhost", () => {
    console.log("Running my first server on http://localhost:8080");
});