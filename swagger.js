const swagger = require('swagger-autogen')();

const doc = {
    info: {
        title: "Contacts API",
        description: "Contacts are here."
    },
    host: "cse341-j0ct.onrender.com",
    schemes: ['https']
};

const output = "./swagger.json";
const server = ["./server.js"];
swagger(output, server, doc).then(() => {
    require('./server.js');
});