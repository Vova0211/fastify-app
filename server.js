import path from 'path'
import Fastify from 'fastify';
import fastifyView from '@fastify/view'
import fastifyStatic from '@fastify/static'
import fastifyFormbody from '@fastify/formbody';
import fastifyJwt from 'fastify-jwt';
import { object, string, boolean } from 'yup'
import pug from 'pug'
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url'
import bcrypt from 'bcrypt';


import { updateTask } from './src/funcs.js';
// import { setRoutes } from './src/routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fastify = Fastify({
  logger: true
});
const data = {
  tasks: [],
  user: {
    login: '',
    password: '',
  }
}
const saltRounds = 8

fastify.register(fastifyJwt, {
  secret: 'supersecretkey',
  sign: {
    expiresIn: '1h'
  }
});

fastify.register(fastifyStatic, {
  root: path.join(__dirname, 'scripts'),
  prefix: '/scripts/',
})

fastify.register(fastifyView, {
  engine: {
    pug: pug,
  },
  root: path.join(__dirname, 'templates'),
  propertyName: 'render'
});

fastify.decorate("authenticate", async function(request, reply) {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.send(err);
  }
});

fastify.register(fastifyFormbody)

fastify.get('/login', async (request, reply) => {
  return reply.status(200).render('login.pug', {});
})

fastify.post('/login', async (request, reply) => {
  const body = JSON.parse(request.body)
  const { username, password } = body;
  const { user } = data
  const uPassword = user.password
  
  if (username === user.login && await bcrypt.compare(password, uPassword)) {
    const token = fastify.jwt.sign({ username, role: 'admin' });
    return { token };
  }

  return reply.status(401).send({ error: 'Неверные данные' });
});

fastify.get('/register', (request, reply) => {
  const { user } = data
  return reply.status(200).render('register.pug', { user });
})

fastify.post('/register', async (request, reply) => {
  const body = JSON.parse(request.body)
  const { login, password } = body

 
    
  const passwordHash = await bcrypt.hash(password, saltRounds)

  data.user = {
    login,
    password: passwordHash
  }
  reply.status(201).send(data.user)
})

fastify.get('/', {preHandler: [fastify.authenticate]}, (request, reply) => {
  const tasks = data
  reply.status(200).render('index.pug', { tasks });
});

fastify.post('/add', {
  attachValidation: true,
  schema: {
    body: object({
      title: string().min(2)
    })
  },
  validatorCompiler: ({ schema, method, url, httpPart }) => (data) => {
    try {
      const parsedData = JSON.parse(data)
      const result = schema.validateSync(parsedData)
      return { value: result }
    }
    catch (e) {
      return { error: e }
    }
  }
}, (request, reply) => {
  const { title } = request.body
  const { tasks } = data
  if (request.validationError) reply.status(400).send(request.validationError)

  const task = { id: uuidv4(), title, completed: false }
  tasks.push(task)
  reply.status(201).send(task)
});

fastify.put('/update/:id', {
  attachValidation: true,
  schema: {
    body: object({
      title: string().min(2),
      completed: boolean().required()
    }),
    params: object({
      id: string().required().length(36)
    })
  },
  validatorCompiler: ({ schema, method, url, httpPart }) => (data) => {
    try {
      const parsedData = JSON.parse(data)

      console.log('\n', data, '\n')
      const result = schema.validateSync(parsedData)
      return { value: result }
    } catch(e) {
      return { error: e }
    }
  }
}, async (request, reply) => {
  const { tasks } = data
  const taskId = request.params.id
  const data = JSON.parse(request.body)
  updateTask(tasks, taskId, data)

  reply.status(200).send({ message: 'OK' })
});


fastify.delete('/delete/:id', (request, reply) => {
  const { tasks } = data
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
    console.log(`\nServer listening on http://localhost:${settings.port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();