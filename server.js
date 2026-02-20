const path = require('path');
const Fastify = require('fastify');
const fastifyView = require('@fastify/view');
const fastifyStatic = require('@fastify/static')
const pug = require('pug');
const { v4: uuidv4 } = require('uuid')

const fastify = Fastify({
  logger: true
});

const tasks = []

fastify.register(fastifyStatic, {
  root: path.join(__dirname, 'src'),
  prefix: '/src/',
})

fastify.register(fastifyView, {
  engine: {
    pug: pug,
  },
  root: path.join(__dirname, 'templates'),
  propertyName: 'render'
});

fastify.get('/', (request, reply) => {
  reply.render('index.pug', { tasks, title: 'TaskBoard'});
});

fastify.post('/add', (request, reply) => {
  const name = JSON.parse(request.body).data
  tasks.push({ id: uuidv4(), name })
  reply.status(201).send()
});

fastify.delete('/delete/:id', (request, reply) => {
  const deleteId = request.params.id
  const updatedTasks = tasks.filter(e => e.id != deleteId)
  tasks.splice(0, tasks.length, ...updatedTasks)
  reply.status(204).send()
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