const path = require('path');
const Fastify = require('fastify');
const fastifyView = require('@fastify/view');
const pug = require('pug');

const fastify = Fastify({
  logger: true
});

fastify.register(fastifyView, {
  engine: {
    pug: pug
  },
  root: path.join(__dirname, 'templates'), // Points to the 'views' directory
  propertyName: 'render' // Access the render function via reply.render()
});

fastify.get('/', (request, reply) => {
  reply.render('index.pug', {
    title: 'Fastify Pug Example',
    message: 'Hello from Fastify and Pug!'
  });
});


const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
    console.log('Server listening on http://localhost:3000');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();