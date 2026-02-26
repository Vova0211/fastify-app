import path from 'path'
import Fastify from 'fastify';
import fastifyView from '@fastify/view'
import fastifyStatic from '@fastify/static'
import pug from 'pug'
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fastify = Fastify({
  logger: true
});

function validateTask(taskId, data, reply) {
  const task = tasks.find(e => e.id == taskId)
  if (!task) {
    reply.code(404).send({ message: 'Task not found' });
    return
  }
  const dataKeys = Object.keys(data)
  if (!dataKeys.includes('title') || !dataKeys.includes('completed')) {
    reply.code(400).send({ message: 'Invalid data' })
  }
}

function updateTask(id, data) {
  const index = tasks.findIndex(e => e.id == id)
  const task = tasks[index]
  const updated = tasks.with(index, { ...task, ...data })
  tasks.splice(0, tasks.length, ...updated)
}
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
  reply.status(200).render('index.pug', { tasks });
});

fastify.post('/add', (request, reply) => {
  const body = JSON.parse(request.body)
  const task = { id: uuidv4(), title: body.title, completed: false }
  tasks.push(task)
  reply.status(201).send(task)
});

fastify.put('/update/:id', async (request, reply) => {
  const taskId = request.params.id
  const data = JSON.parse(request.body)
  validateTask(taskId, data, reply)
  updateTask(taskId, data)

  reply.status(200).send({ message: 'OK' })
});

fastify.delete('/delete/:id', (request, reply) => {
  const taskId = request.params.id
  const updatedTasks = tasks.filter(e => e.id != taskId)
  if (updatedTasks.length == tasks.length) reply.status(404).send({ message: 'Item not found' })
  tasks.splice(0, tasks.length, ...updatedTasks)
  reply.status(200).send({ message: 'OK' })
});


const start = async () => {
  try {
    const settings = { port: 3000 }
    await fastify.listen(settings);
    console.log(`Server listening on http://localhost:${settings.port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();