const fastify = require('fastify')();
const msgpack = require("msgpack-lite");
const compression = require('compression');

const generateMessage = () => ({
    ts: (new Date).getTime(),
    name: "andre"
});


fastify.use(compression());
fastify.get('/', async (request, reply) => {
    const encodeStream = msgpack.createEncodeStream();
    for (let i = 0; i < 10000000; i++) {
        encodeStream.write(generateMessage());
        encodeStream.flush();
    }
    reply.send(encodeStream);
    encodeStream.end();

});

const start = async () => {
    try {
        await fastify.listen(3000);
        fastify.log.info(`server listening on ${fastify.server.address().port}`)
    } catch (err) {
        fastify.log.error(err);
        process.exit(1)
    }
};
start();
