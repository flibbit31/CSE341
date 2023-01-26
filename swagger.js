const swagger = require('swagger-autogen')();

const doc = {
    info: {
        title: "Contacts API",
        description: "Contacts are here."
    }
    
};

const output = "./swagger.json";
const server = ["./server.js"];
swagger(output, server, doc).then(() => {
    require('./server.js');
});