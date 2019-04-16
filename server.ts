import * as fastify from "fastify"
import {Http2Server, Http2ServerRequest, Http2ServerResponse } from "http2"

const generateMessage = () => ({
    ts: (new Date).getTime(),
    name: "Andre"
})

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
}

server.get('/ping', opts, (request, reply) => {
    console.log(reply.res)
    reply.code(200).send({pong: 'it worked'})
})

process.exit(0)