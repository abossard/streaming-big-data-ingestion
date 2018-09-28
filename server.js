const http = require('http');
const msgpack = require("msgpack-lite");

const generateMessage = () => ({
    ts: (new Date()).getTime(),
    name: "andre"
});

http.createServer(function (request, response) {
    response.writeHead(200, {'Content-Type': 'application/octet-stream', 'Transfer-Encoding': 'chunked'});
    const encodeStream = msgpack.createEncodeStream();
    let i = 0;
    const max = 100000000;

    function send() {
        for (; i < max; i++) {
            let result = encodeStream.write(generateMessage());
            if(!result) {
                console.log("Backpressure, let's relax");
                break;
            }
        }
    }

    send();
    encodeStream.pipe(response);
    encodeStream.on('drain', () => {
        console.log("Drain");
        send();
        if(i >= max -1) {
            console.log("End");
            encodeStream.end();
        }
    });
}).listen(3000);
