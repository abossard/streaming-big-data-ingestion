import * as fastify from "fastify"
import {Http2Server, Http2ServerRequest, Http2ServerResponse } from "http2"
import * as compress from "fastify-compress"
import * as msgpack5 from "msgpack5"
const generateMessage = () => ({
    ts: (new Date).getTime(),
    name: "Andre"
});

const msgpack = msgpack5();

const server: fastify.FastifyInstance<Http2Server, Http2ServerRequest, Http2ServerResponse> = fastify({})

const opts: fastify.RouteShorthandOptions<Http2Server, Http2ServerRequest, Http2ServerResponse> = {
    schema: {
        response: {
            200: {
                type: 'object',
                properties: {
                    pong: {
                        type: 'string'
                    }
                }
            }
        }
    }
};

server.register(compress);

server.get('/generate', opts, (request, response) => {
    const stream = msgpack.encoder();
    let i = 0;
    const max = 10000000;
    const send = () => {
        for (; i < max; i++) {
            let success = stream.write(generateMessage());
            if(!success) {
                server.log.warn("Backpressure");
                break;
            }

        }
    };
    send();
    stream.pipe(response.res);
    stream.on('drain', () => {
        server.log.warn("Drain");
        send();
        if(i >= max -1) {
            console.log("End");
            stream.end();
        }
    });
});

const start = async () => {
    try {
        await server.listen(3000);
        server.log.info(`server listening on ${server.server.address()}`)
    } catch (err) {
        server.log.error(err);
        process.exit(1)
    }
};
start();
