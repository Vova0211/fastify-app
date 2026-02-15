const path = require('path');
const Fastify = require('fastify');
const fastifyView = require('@fastify/view');
const pug = require('pug');

const fastify = Fastify({
  logger: true
});

const tasks = []

fastify.register(fastifyView, {
  engine: {
    pug: pug,
  },
  root: path.join(__dirname, 'templates'), // Points to the 'views' directory
  propertyName: 'render' // Access the render function via reply.render()
});

fastify.get('/', (request, reply) => {
  reply.render('index.pug', { tasks, title: 'TaskBoard' });
});

fastify.get('/add', (request, reply) => {
  const name = request.query.task
  tasks.push({ id: tasks.length, name })
  reply.redirect('/')
});

fastify.get('/delete', (request, reply) => {
  const deleteId = request.query.index
  const updatedTasks = tasks.filter(e => e.id != deleteId)
  tasks.splice(0, tasks.length, ...updatedTasks)
  reply.redirect('/')
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